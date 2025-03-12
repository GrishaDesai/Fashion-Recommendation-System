import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Recommendation from './Screen/Recommendation';
import AllProduct from './Screen/AllProduct';
import AllCategories from './Screen/AllCategories';
import Product from './Screen/Product';
import BodyShapeForm from './Screen/BodyShapeForm';
import BodyShapeQuiz from './Screen/BodyShapeQuiz';
import Home from './Screen/Home';
import CategoryProducts from './Screen/CategoryProduct';
import './App.css'
import './index.css'

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/recommend/:id' element={<Recommendation/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/category/:category' element={<CategoryProducts/>}/>
        <Route path='/allProducts' element={<AllProduct/>}/>
        <Route path='/category' element={<AllCategories/>}/>
        <Route path='/cat_product/:category' element={<Product />} />
        {/* <Route path='/category/:category' element={<Product/>}/> */}
        <Route path='/body-shape/measurements' element={<BodyShapeForm/>}/>
        <Route path='/body-shape-quiz/' element={<BodyShapeQuiz/>}/>
      </Routes>
    </BrowserRouter>
  )
}
