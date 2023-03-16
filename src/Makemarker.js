import { Button } from "@mui/material";
import React, { useState } from "react";
import ImageLogo from "./movie.svg";
import "./Makemarker.css";

// QR関係
// import { useQRCode } from 'react-qrcodes';
import ReactDOM from 'react-dom';
import {QRCodeSVG,QRCodeCanvas} from 'qrcode.react';

// firebase
import firebase from "./firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  uploadString,
  uploadBytes,
} from "firebase/storage";
// ページ遷移
import { Link, useLocation } from "react-router-dom";
// THREE.JS
import THREEx from "./threex-arpatternfile.js";

const MovieUploader = () => {
  const DefaultAROption = [1,2,3,4,5,6];
  const [DefaultARvalue, setDefaultAR] = React.useState(DefaultAROption[0])

  // idの取得
  // const { state } = useLocation();
  // const user_id = state.user_id;
  const user_id = "TzxJ9ox39PmW84TgS19x";
  console.log("id取得" + user_id);

  const [loading, setLoading] = useState(false);
  const [isUploaded, setUploaded] = useState(false);

  // 送信された画像パス（予定：今は用意したパス）⇒Defaltを準備してもいいかも
  var innerImageURL = `${process.env.PUBLIC_URL}/testsrc/test.jpg`;
  var imageName = "test";
  // 作成したARマーカーのパス
  var fullMarkerURL = null;
  var PattarnFileURL = null;

  // DB保存用 Storageにおけるパス
  var strageFilePath_ARmarker_img = null;
  var strageFilePath_ARmarker_pattern = null;

  // 卒アルQR
  var qr_path = "https://test-arbum.web.app/reader?user_id=" + user_id;

  // DBにARマーカーの情報を格納
  const updateDB_ARmarker = async () => {
    // DB登録
    console.log("DB保存開始 marker_id" + DefaultARvalue);
    try {
      const userRef = await updateDoc(doc(firebase.db, "arbum_data", user_id), {
        // marker_img_path: strageFilePath_ARmarker_img,
        // marker_pattern_path: strageFilePath_ARmarker_pattern,
        marker_id: DefaultARvalue
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // ARマーカー作成

  

  const FinishMakeMarker = async() => {
    // DB格納
    await updateDB_ARmarker();
    // ARマーカ画像出力
    OutPutMakerImage();

    // ページ遷移orQR生成
    setUploaded(true);
  };

  // ARマーカ画像出力
  const OutPutMakerImage = () => {
    var domElement = window.document.createElement("a");
    domElement.href = process.env.PUBLIC_URL + "/defaultAR/pattern-"+DefaultARvalue+".png";
    domElement.download = "pattern-" + (imageName || "marker") + ".png";
    document.body.appendChild(domElement);
    domElement.click();
    document.body.removeChild(domElement);
  };

  const DownloadQR = () =>{
    let canvas = document.getElementById("canvas_qr");
    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    link.click();
  }

  const noradio = {
    display: 'none'
  };

  // 選択したときのスタイル
  const checkDefaultARmakerstyle = (value) => {
    if(value == DefaultARvalue){
      return {
        border:'3px solid #000'
      }
    }else{
      return {
        border:'none'
      }
    }
  }

  // ラジオボタンの値がチェンジされた時
  const handleChange = (e) => {
    setDefaultAR(e.target.value);
  };

    // header処理
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
    <>
      {loading ? (
        <h2>アップロード中・・・</h2>
      ) : (
        <>
          {isUploaded ? (
            <>
              <QRCodeCanvas id = "canvas_qr" value={qr_path} />,
                <p>
                  <Button variant="contained" onClick={DownloadQR}>
                    QRコードのダウンロード
                  </Button>
                </p>
                <br></br>
              <div className="result">
                <h2 id="result">
                  <p>アップロード完了しました！</p>
                </h2>
              </div>
            </>
          ) : (
            <div id="makemarker-screen">
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
              <img id="step3-progress" src="img/step3-progress.png"/>
              {/* DefaltARマーカ */}
              {/* 今後増やすことも考えたら配列で定義してfor文で書きたいね */}
              <div id="makemarker-ex">
                <p id="makemarker-ex1">使用するARマーカーを</p>
                <p id="makemarker-ex2">選んでください</p>
              </div>
              <div id="marker-contents">
                {DefaultAROption.map(i => (
                  <label for={"Default_" + i}>
                    <input type="radio" name="DefaultAR" value={i} id={"Default_" + i} style={noradio} onChange={handleChange} checked={i === DefaultARvalue}/>
                  <img src={process.env.PUBLIC_URL + "/defaultAR/pattern-"+i+".png"} with="200" height="200" style={checkDefaultARmakerstyle(i)}/> 
                  </label>
                  ))
                }
                {/* <Button variant="contained" onClick={CreateARMaeker}>
                  ARマーカ作成
                </Button> */}
                <Button variant="contained" onClick={FinishMakeMarker}>
                  決定
                </Button>
              </div>

              {/* ARマーカのプレビュー表示 */}
              {/* <div id="imageContainer"></div> */}
            </div>
          )};
        </>
      )};
    </>
  );
};


export default MovieUploader;
