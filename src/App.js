import React, { useRef, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import "./style.css";
import MovieUploader from "./MovieUploader";
import Makemarker from "./Makemarker";
import TextUploader from "./TextUploader";
import ARReader from "./ARReader";
import ParticlesBackground from "./particlesBackground";
import { doc } from "firebase/firestore";

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
  window.onload = function(){
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");

    console.log(navLinks)

    burger.addEventListener("click", () => {
      nav.classList.toggle("nav-active");

      navLinks.forEach((link, index) => {
        if(link.style.animation) {
          link.style.animation = "";
        } else {
          link.style.animation = `navlinksFade 0.5s ease forwards ${index / 7+0.4}s`;
          console.log("index", index);
        }
      });
      burger.classList.toggle("toggle");
    });
  }
    return (
      <html>
        <head>
          <title>Welcome</title>
          <link rel="stylesheet" type="text/css" href="../css/style.css"/>
          {/* <ParticlesBackground /> */}
        </head>
        <body>
          <div id="start-screen" className="a">
            <nav>
              <div className="logo">
                <img id="logo-img" src="img/app_icon_v2.png"/>
                <h4 id="nav_title">ARバムめーかー</h4>
              </div>
              <ul className="nav-links">
                <li><a href="#center_ex2">動画投稿</a></li>
                <li><a href="#step1_ex4">文字投稿</a></li>
                <li><a href="#step2_ex4">マーカー作成</a></li>
                <li><a href="#step5_ex4">使い方</a></li>
              </ul>
              <div className="burger">
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
              </div>
            </nav>

            <div id="title_box">
              <div id="logo_frame">
                <img id="app_icon" src="img/app_icon_v2.png"/>
                <p id="main_logo" >ARバムめーかー</p>
              </div>
              <p id="main_explane">自分だけのアルバムをつくろう！</p>
              <p><Link to="/about"><button id="start_button" className="start-button"><a>今すぐはじめる</a></button></Link></p>
              {/* <p><Link to="/marker">ARマーカー生成（Debug）</Link></p>
              <p><Link to={"/reader"} >readerへ移動する</Link></p> */}
            </div>
            <div id="ctachfrase_box">
              <p id="catchfrase">思い出を、声で、映像で。</p>
              <p id="catch_ex_1">紙のアルバムには収まりきらない仲間との思い出を映像で記録します。</p>
              <p id="catch_ex_2">スマホをかざせば、いつでもそこには当時の姿が。</p>
            </div>
            <div id="demo_box">
              <div id="demo_img_box">
                <img id="demo_img" src="img/app_icon_v2.png"/>
              </div>
              <p id="demo1_title">面倒な管理が一切不要</p>
              <p id="demo1_ex">必要な物は、アルバムとスマホだけ。</p>
              <p id="demo2_title">先輩や同期への寄せ書きとして</p>
              <p id="demo2_ex">直接では伝えづらいことも</p>
              <p id="demo2_ex2">映像にに声を乗せて永久に保存できます</p>
              <p id="demo3_title">一押しの映像をアルバムと共に</p>
              <p id="demo3_ex">印象に残っている映像をいつでも再生できます</p>
              <p id="demo3_ex2">アルバムが保存される限り、なくなることはありません</p>
            </div>
            <div id="center_ex">
              <p id="center_ex1">卒業アルバムなどに作成したARマーカ―を添付し</p>
              <p id="center_ex2">専用のwebページで読み込むことで投稿した動画を視聴することができます。</p>
            </div>
            <div id="how_to_use">
              <img id="step1-2-arrow" src="img/arrow.png"/>
              <img id="step2-3-arrow" src="img/arrow.png"/>
              <img id="step3-4-arrow" src="img/arrow.png"/>
              <img id="step4-5-arrow" src="img/arrow.png"/>
              <img id="step5-6-arrow" src="img/arrow.png"/>
              <p id="how_to_use_string">つかいかた</p>
              <div id="step1_box">
                <p id="step1_title">Step1：動画の投稿</p>
                <p id="step1_ex1">マーカーにカメラをかざした時に</p>
                <p id="step1_ex2">表示する文字を投稿します</p>
                <p id="step1_ex3">投稿できる動画は</p>
                <p id="step1_ex4">mp4のみとなります</p>
                <img id="step1_img" src="img/step1.png"/>
              </div>
              <div id="step2_box">
                <p id="step2_title">Step2：テキストの投稿</p>
                <p id="step2_ex1">動画とともに表示したい</p>
                <p id="step2_ex2">文字を入力します</p>
                <p id="step2_ex3">入力のあと、色や大きさを選んで</p>
                <p id="step2_ex4">表示する文字を決定します</p>
                <img id="step2_img" src="img/step2.png"/>
              </div>
              <div id="step3_box">
                <p id="step3_title">Step3：ARマーカーをつくる</p>
                <p id="step3_ex1">動画を再生するための</p>
                <p id="step3_ex2">ARマーカーを作成します</p>
                <p id="step3_ex3">いくつかの選択肢の中から</p>
                <p id="step3_ex4">使用したい場面に応じたデザインを</p>
                <p id="step3_ex5">選んでください</p>
                <img id="step3_img" src="img/step3.png"/>
              </div>
              <div id="step4_box">
                <p id="step4_title">Step4：QRコードのダウンロード</p>
                <p id="step4_ex1">ARマーカーを読み取るための</p>
                <p id="step4_ex2">専用のウェブサイトにつながる</p>
                <p id="step4_ex2-2">QRコードをつくります</p>
                <p id="step4_ex3">ダウンロードして</p>
                <p id="step4_ex4">大切に保管しておいてください</p>
                <img id="step4_img" src="img/step4.png"/>
              </div>
              <div id="step5_box">
                <p id="step5_title">Step5：アルバムなどに貼付する</p>
                <p id="step5_ex1">ARマーカーをお好きなものや場所に</p>
                <p id="step5_ex2">貼り付けます</p>
                <p id="step5_ex3">QRコードと一緒に添付しておくと、</p>
                <p id="step5_ex4">より簡単にシステムを利用出来ます</p>
                <img id="step5_img" src="img/step5.png"/>
              </div>
              <div id="step6_box">
                <p id="step6_title">Step6：見て、聞いて、楽しむ。</p>
                <p id="step6_ex1">プレゼントするもよし、</p>
                <p id="step6_ex2">思い出として保管しておくもよし。</p>
                <p id="step6_ex3">使い方は無限大</p>
                <p id="step6_ex4">ぜひ，楽しんでみてください。</p>
                <img id="step6_img" src="img/step6.png"/>
              </div>
            </div>
            <div id="page-last">
              <p id="lets-try">さあ、始めよう！</p>
              <p id="lets-ex">未来に残る自分だけのアルバムを作成しよう</p>
              <p><Link to="/about"><button className="lets-use" ><a>使ってみる</a></button></Link></p>
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
