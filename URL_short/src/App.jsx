import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './component/Register';
import Login from './component/Login';
import HomePage from './component/HomePage';
import UrlList from './component/Urllist';



function App() {
  return (
   
    <BrowserRouter>

    <Routes>
        
    <Route path='/' element={<HomePage/>}></Route>
     
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/shorten" element={<UrlList/>}/>
    </Routes>
  </BrowserRouter>
  );
}
export default App;
