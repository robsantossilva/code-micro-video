<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;

class CategoryController extends BasicCrudController
{

    private $rules = [
      'name'=>'required|max:255',
      'description'=>'nullable',
      'is_active'=>'boolean'
    ];

    protected function model()
    {
      return Category::class;
    }

    protected function ruleStore()
    {
      return $this->rules;
    }

    protected function ruleUpdate()
    {
      return $this->rules;
    }

    // private $rules = [
    //     'name'=>'required|max:255',
    //     'is_active'=>'boolean'
    // ];

    // /**
    //  * Display a listing of the resource.
    //  *
    //  * @return \Illuminate\Http\Response
    //  */
    // public function index(Request $request)//GET
    // {
    //     if($request->has('only_trashed')){
    //         return Category::onlyTrashed()->get();
    //     }
    //     return Category::all();
    // }

    // /**
    //  * Store a newly created resource in storage.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @return \Illuminate\Http\Response
    //  */
    // public function store(Request $request)
    // {
    //     $this->validate($request, $this->rules);
    //     $category = Category::create($request->all());
    //     $category->refresh();
    //     return $category;
    // }

    // /**
    //  * Display the specified resource.
    //  *
    //  * @param  \App\Models\Category  $category
    //  * @return \Illuminate\Http\Response
    //  */
    // public function show(Category $category) //GET
    // {
    //     return $category;
    // }

    // /**
    //  * Update the specified resource in storage.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @param  \App\Models\Category  $category
    //  * @return \Illuminate\Http\Response
    //  */
    // public function update(Request $request, Category $category)
    // {
    //     $this->validate($request, $this->rules);
    //     $category->update($request->all());
    //     return $category;
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  *
    //  * @param  \App\Models\Category  $category
    //  * @return \Illuminate\Http\Response
    //  */
    // public function destroy(Category $category)
    // {
    //     $category->delete();
    //     return response()->noContent();//204 - No Content
    // }
}
