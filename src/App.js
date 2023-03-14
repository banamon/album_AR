import React, { useRef, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import "./style.css";
import MovieUploader from "./MovieUploader";
import Makemarker from "./Makemarker";
import TextUploader from "./TextUploader";
import ARReader from "./ARReader";
import ParticlesBackground from "./particlesBackground";

const App = () => {
  return (
    <BrowserRouter>
      <div className="5">
      {/* <div className="container text-center mt-5"> */}
        <Routes>
            <Route path={`/`} element={<Home />} />
            <Route path={`/about/`} element={<About />} />
            <Route path={`/marker/`} element={<Marker />} />
            <Route path={`/text/`} element={<TextUploader />} />
            <Route path={`/reader/`} element={<Reader />} />
            {/* <Route path={`/reader?user_id=3SFzC76qlfq9yO264F6G/`} element={<Reader />} /> */}
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
          <link rel="stylesheet" type="text/css" href="../css/style.css"/>
          {/* <ParticlesBackground /> */}
        </head>
        <body>
          <div id="start-screen" className="a">
            <div id="title_box">
              <div id="logo_frame">
                <img id="app_icon" src="img/app_icon.png"/>
                <p id="main_logo" >ARバムめーかー4</p>
              </div>
              <p id="main_explane">自分だけのアルバムを作成しよう！</p>
              <p><Link to="/about"><button id="start_button" className="start-button"><a>今すぐはじめる</a></button></Link></p>
              <p><Link to="/marker">ARマーカー生成（Debug）</Link></p>
              <p><Link to="/marker">テキスト投稿（Debug）</Link></p>
              <p><Link to={"/reader"} >readerへ移動する</Link></p>
            </div>
            <div id="ctachfrase_box">
              <p id="catchfrase">思い出を、声で、映像で。</p>
              <p id="catch_ex_1">紙のアルバムには収まりきらない仲間との思い出を映像で記録します。</p>
              <p id="catch_ex_2">スマホをかざせば、いつでもそこには当時の姿が。</p>
            </div>
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
