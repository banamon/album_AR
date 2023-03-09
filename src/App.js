import React, { Component } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import MovieUploader from "./MovieUploader";
import Makemarker from "./Makemarker";
import ARReader from "./ARReader";

const App = () => {
  return (
    <BrowserRouter>
      <div className="container text-center mt-5">
        <Routes>
            <Route path={`/`} element={<Home />} />
            <Route path={`/about/`} element={<About />} />
            <Route path={`/marker/`} element={<Marker />} />
            <Route path={`/reader/`} element={<Reader />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const Home = () => {
  return (
    <html>
      <head>
        <title>Welcome</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
      </head>
      <body>
        <div className="welcome-container">
          <h1>ようこそ</h1>
          <p>そつあるさくせい</p>
          <p><Link to="/about"><button className="start-button">スタート</button></Link></p>
          <p><Link to="/marker">ARマーカー生成（Debug）</Link></p>
          <p><Link to="/reader">リーダー（Debug）</Link></p>
        </div>
      </body>
    </html>
  )
}

const About = () => {
  return (
    <div className="App">
      {/* uplodaer */}
      <MovieUploader />
    </div>
  );
}

const Marker = () => {
  return (
    <div className="Marker">
      {/* makemarker */}
      <Makemarker />
    </div>
  );
}

const Reader = () => {
  return (
    <div className="Reader">
      {/* ARReader */}
      <ARReader />
    </div>
  )
}

export default App;
