import { Button } from "@mui/material";
import React, { useState } from "react";
import ImageLogo from "./movie.svg";
import "./MovieUpload.css";

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
  const [DefaultARvalue, setDefaultAR] = React.useState("A")


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
    // var patternRatio = document.querySelector('#patternRatioSlider').value/100
    // var imageSize = document.querySelector('#imageSize').value
    // var borderColor = document.querySelector('#borderColor').value

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

        // 本当はここから下は，ARマーカ作成完了 というボタンを押したら実行する方がいい気がする

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
    console.log("選択:" + DefaultARvalue);
    innerImageURL = process.env.PUBLIC_URL + "/testsrc/defaultAR/"+DefaultARvalue+".png"
    updateFullMarkerImage();
  }

  // ラジオボタンの値がチェンジされた時
  const handleChange = (e) => {
    setDefaultAR(e.target.value);
  };

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
            <div className="outerBox">
              <div className="title">
                <h2>ARマーカ作成</h2>
                <p>画像アップロード</p>
              </div>
              {/* DefaltARマーカ */}
              {/* 今後増やすことも考えたら配列で定義してfor文で書きたいね */}
              <div>
                <label for="Default_A">
                  <input type="radio" name="DefaultAR" value="A" id="Default_A" style={noradio} onChange={handleChange} checked={"A" === DefaultARvalue}/>
                  <img src={process.env.PUBLIC_URL + "/testsrc/defaultAR/A.png"} with="40" height="40" style={checkDefaultARmakerstyle("A")}/> 
                </label>
                <label for="Default_B">
                  <input type="radio" name="DefaultAR" value="B" id="Default_B" style={noradio} onChange={handleChange} checked={"B" === DefaultARvalue}/>
                  <img src={process.env.PUBLIC_URL + "/testsrc/defaultAR/B.png"} with="40" height="40" style={checkDefaultARmakerstyle("B")}/> 
                </label>
                <label for="Default_C">
                  <input type="radio" name="DefaultAR" value="C" id="Default_C" style={noradio} onChange={handleChange} checked={"C" === DefaultARvalue}/>
                  <img src={process.env.PUBLIC_URL + "/testsrc/defaultAR/C.png"} with="40" height="40" style={checkDefaultARmakerstyle("C")}/> 
                </label>
              </div>
              <Button variant="contained" onClick={CreateARMaeker}>
                ARマーカ作成
              </Button>
              


              <div className="movieUplodeBox">
                <div className="movieLogoAndText">
                  <img src={ImageLogo} alt="imagelogo" />
                  <p>ここにドラッグ＆ドロップしてください</p>
                </div>
                <input
                  className="movieUploadInput"
                  multiple
                  name="movieURL"
                  type="file"
                  accept="image/*,.png,.jpg,.jpeg,.gif"
                  onChange={UploadinnerImage}
                />
              </div>
              <p>または</p>
              <Button variant="contained">
                ファイルを選択
                <input
                  className="movieUploadInput"
                  type="file"
                  onChange={UploadinnerImage}
                  accept="image/*,.png,.jpg,.jpeg,.gif"
                />
              </Button>

              {/* <Button variant="contained" onClick={OutPutPattarnFile}>
                ARマーカ pattファイル出力
              </Button> */}
              <Button variant="contained" onClick={FinishMakeMarker}>
                ARマーカ作成を完了する
              </Button>

              {/* ARマーカのプレビュー表示 */}
              <div id="imageContainer"></div>
              {/* <img id="qr-code" src="qr-code.png" alt="qr-code" className="qr-code"/> */}
              {/* <QRCodeSVG value="https://reactjs.org/" /> */}
              <input id="patternRation" className="mdl-silder" type="range" min="10" max="90" value="50" tabIndex="0">
              </input>

            </div>
          )}
        </>
      )}
    </>
  );
};


export default MovieUploader;
