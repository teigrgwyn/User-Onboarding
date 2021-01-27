import React from 'react';
import * as Yup from 'yup'; // lambda suggestion for 'less bugginess'
import Axios from 'axios';
import Form from './Form';
import './App.css';

function App() {
  return (
    <div className="App">
      <Form />
    </div>
  );
}

export default App;
