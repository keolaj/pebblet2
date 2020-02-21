import React from 'react';
import './App.css';
import './components/signUp';
import SignUp from './components/signUp';

const axios = require('axios');

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SignUp />
      </header>
    </div>
  );
}

export default App;
