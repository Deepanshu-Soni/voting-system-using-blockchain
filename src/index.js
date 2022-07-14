import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./bootstrap.min.css";
import {initializeApp} from "firebase/app";

// const firebaseConfig = {
//   apiKey: "",
//   authDomain: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: "",
//   appId: "",
//   databaseURL: ""
// };
const firebaseConfig = {
  apiKey: "AIzaSyCshFJ96xJaikYNH1oqhd-FLCNCM3VD2o4",
  authDomain: "online-voting-system-6abf1.firebaseapp.com",
  databaseURL: "https://online-voting-system-6abf1-default-rtdb.firebaseio.com",
  projectId: "online-voting-system-6abf1",
  storageBucket: "online-voting-system-6abf1.appspot.com",
  messagingSenderId: "335453990335",
  appId: "1:335453990335:web:713455356ba97c6fc0450a",
  measurementId: "G-R3V1QKRBR7"
};

initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
