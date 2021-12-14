import * as React from 'react';
import { makeStyles, MenuItem, TextField, Theme } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import genreHttp from '../../util/http/genre-http';
import categoryHttp from '../../util/http/category-http';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Category, Genre } from '../../util/models';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import SubmitActions from '../../components/SubmitActions';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

const validationSchema = yup.object().shape({
    name: yup.string()
        .required()
        .max(255)
        .label('Name'),
    categories_id: yup.array()
        .required()
        .label('Categories')
});

interface FormProps {
    id?:string
}

export const Form: React.FC<FormProps> = ({id}) => {

    const { 
        register, 
        handleSubmit, 
        getValues,
        reset,
        watch,
        setValue,
        errors,
        triggerValidation
    } = useForm<{name, categories_id}>({
        validationSchema,
        defaultValues: {
            categories_id: []
        }
    });

    const classes = useStyles();   
    const snackbar = useSnackbar();
    const history = useHistory();
    const [genre, setGenre] = useState<Genre | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            const promises = [categoryHttp.list({queryParams:{all:''}})];

            if (id) {
                promises.push(genreHttp.get(id));
            }
            try {
                const [categoriesResponse, genreResponse] = await Promise.all(promises);
                if(isSubscribed){
                    setCategories(categoriesResponse.data.data);
                    if (id) {
                        setGenre(genreResponse.data.data);
                        const categories_id = genreResponse.data.data.categories.map(category => category.id);
                        const dataForm = {
                            ...genreResponse.data.data,
                            categories_id
                        }
                        //console.log(dataForm);
                        reset(dataForm);
                    }
                }                    
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Error trying to load genre',
                    {variant: 'error',}
                )
            } finally {
                setLoading(false);
            }
        })();

    }, []); //[]


    useEffect(() => {
        register({name: "categories_id"})
    }, [register]);

    async function onSubmit(formData, event) {
        setLoading(true);
        try{
            const http = !id
            ? genreHttp.create(formData)
            : genreHttp.update(genre?.id, formData);
            const {data} = await http;
            snackbar.enqueueSnackbar(
                'Genre saved successfully',
                {variant:"success"}
            );
            setTimeout(() => {
                if(event){
                    if(id){
                        history.replace(`/genres/${data.data.id}/edit`)
                    }else{
                        history.push(`/genres/${data.data.id}/edit`)
                    }
                }else{
                    history.push('/genres')
                }
            });
        }catch (err) {
            console.log(err);
            snackbar.enqueueSnackbar(
                'Error trying to save genre',
                {variant:"error"}
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Name"
                fullWidth
                variant={"outlined"}
                inputRef={register}
                error={errors.name !== undefined}
                helperText={errors.name && errors.name.message}
                InputLabelProps={{shrink: (getValues('name') !== undefined ? true : undefined) }}
                disabled={loading}
            />
            <TextField
                select
                name="categories_id"
                value={watch('categories_id')}
                label="Categories"
                margin={'normal'}
                variant={"outlined"}
                fullWidth
                onChange={(e) => {
                    setValue('categories_id', e.target.value);
                }}
                SelectProps={{
                    multiple: true
                }}
                error={errors.categories_id !== undefined}
                helperText={errors.categories_id && errors.categories_id.message}
                InputLabelProps={{shrink: true}}
                disabled={loading}
            >

                <MenuItem value="" disabled>
                    <em>Select categories</em>
                </MenuItem>
                {
                    categories.map(
                        (category, key) => (
                            <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
                        )
                    )
                }
            </TextField>
            <SubmitActions 
                disabledButtons={loading} 
                handleSave={() => 
                    triggerValidation().then(isValid => {
                        isValid && onSubmit(getValues(), null)
                    })  
                }
            />
        </form>
    );
}