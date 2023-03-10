import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Chat from './page/Chat';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Chat></Chat>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
