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
  const { state } = useLocation();
  const user_id = state.user_id;
  // const user_id = "TzxJ9ox39PmW84TgS19x";
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

  // 画像アップロード
  const UploadinnerImage = (e) => {
    console.log("画像Upload");
    var file = e.target.files[0];
    imageName = file.name;
    imageName = imageName.substring(0, imageName.lastIndexOf(".")) || imageName;

    var reader = new FileReader();
    reader.onload = function (event) {
      innerImageURL = event.target.result;

      // ARマーカ作成
      updateFullMarkerImage();
    };
    reader.readAsDataURL(file);
  };

  // DBにARマーカーの情報を格納
  const updateDB_ARmarker = async () => {
    // DB登録
    console.log("DB保存開始");
    try {
      const userRef = await updateDoc(doc(firebase.db, "arbum_data", user_id), {
        marker_img_path: strageFilePath_ARmarker_img,
        marker_pattern_path: strageFilePath_ARmarker_pattern,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // ARマーカー作成
  const updateFullMarkerImage = async () => {
    console.log("updateFullMarkerImage : ARマーカの生成");
    // get patternRatio とりあえずテキトーに設定・自由に変更できるようにしてもいいね
    var patternRatio = 0.6;
    var imageSize = 512;
    var borderColor = "black";

    THREEx.ArPatternFile.buildFullMarker(
      innerImageURL,
      patternRatio,
      imageSize,
      borderColor,
      function onComplete(markerUrl) {
        fullMarkerURL = markerUrl;

        var fullMarkerImage = document.createElement("img");
        fullMarkerImage.src = fullMarkerURL;

        // put fullMarkerImage into #imageContainer
        var container = document.querySelector("#imageContainer");
        while (container.firstChild)
          container.removeChild(container.firstChild);
        container.appendChild(fullMarkerImage);

        console.log("ARマーカー作成完了");

        // ストレージへ保存⇒あとで関数化
        strageFilePath_ARmarker_img = user_id + "/" + "ARmarker.png";
        const storageRef = ref(firebase.storage, strageFilePath_ARmarker_img);
        uploadString(storageRef, fullMarkerURL, "data_url").then((snapshot) => {
          console.log("ARマーカストレージ保存完了");
        });

        // パターンファイル作成開始
        OutPutPattarnFile();
      }
    );
  };

  // ARマーカパターンファイル出力
  const OutPutPattarnFile = () => {
    console.log("ppatファイル作成開始");
    THREEx.ArPatternFile.encodeImageURL(
      innerImageURL,
      function onComplete(patternFileString) {
        const blob = new Blob([patternFileString], { type: "text/plain" });

        // ストレージへ保存⇒あとで関数化
        strageFilePath_ARmarker_pattern = user_id + "/" + "ARmarker.patt";
        const storageRef = ref(
          firebase.storage,
          strageFilePath_ARmarker_pattern
        );

        // 'file' comes from the Blob or File API
        uploadBytes(storageRef, blob).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });

        // DB保存
        updateDB_ARmarker();
      }
    );
  };

  const FinishMakeMarker = () => {
    // ARmarker画像出力
    OutPutMakerImage();
    // ページ遷移orQR生成
    setUploaded(true);
  };

  // ARマーカ画像出力
  const OutPutMakerImage = () => {
    var domElement = window.document.createElement("a");
    domElement.href = fullMarkerURL;
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

  const CreateARMaeker = () =>{
    console.log("最終選択:" + DefaultARvalue);
    innerImageURL = process.env.PUBLIC_URL + "/testsrc/defaultAR/"+DefaultARvalue+".png"
    updateFullMarkerImage();
    FinishMakeMarker();
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
                  <img src={process.env.PUBLIC_URL + "/testsrc/defaultAR/"+i+".png"} with="200" height="200" style={checkDefaultARmakerstyle(i)}/> 
                  </label>
                  ))
                }
                <Button variant="contained" onClick={CreateARMaeker}>
                  ARマーカ作成
                </Button>
                <Button variant="contained" onClick={FinishMakeMarker}>
                  ARマーカ作成を完了する
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
