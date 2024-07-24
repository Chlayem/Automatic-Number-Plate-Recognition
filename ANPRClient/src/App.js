import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/LoginPage';
import Main from './Pages/MainPage';
import './assets/styles/App.css';


const App = () => {
 
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Main/>} />
      </Routes>
    </Router>
  );
};

export default App;
