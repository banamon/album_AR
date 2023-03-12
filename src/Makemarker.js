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
  // idの取得
  const { state } = useLocation();
  const user_id = state.user_id;
  console.log("id取得" + user_id);
  // const user_id="";

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
  var qr_path = "firebase" + user_id;

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
        // strageFilePath_ARmarker_img = user_id + "/" + "ARmarker.png";
        // const storageRef = ref(firebase.storage, strageFilePath_ARmarker_img);
        // uploadString(storageRef, fullMarkerURL, "data_url").then((snapshot) => {
        //   console.log("ARマーカストレージ保存完了");
        // });
        SetStorage_ARmarker_img();

        // パターンファイル作成開始
        OutPutPattarnFile();
      }
    );
  };

  const SetStorage_ARmarker_img=()=>{
    console.log("ARマーカ画像の保存開始");
    strageFilePath_ARmarker_img = user_id + "/" + "ARmarker.png";
    const storageRef = ref(firebase.storage, strageFilePath_ARmarker_img);
    uploadString(storageRef, fullMarkerURL, "data_url").then((snapshot) => {
      console.log("ARマーカストレージ保存完了");
    });
  }

  const SetStorage_ARmarker_pattern=(patternFileString)=>{
            const blob = new Blob([patternFileString], { type: "text/plain" });
    strageFilePath_ARmarker_pattern = user_id + "/" + "ARmarker.patt";
    const storageRef = ref(firebase.storage,strageFilePath_ARmarker_pattern);
    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  }

  // ARマーカパターンファイル出力
  const OutPutPattarnFile = () => {
    console.log("ppatファイル作成開始");
    THREEx.ArPatternFile.encodeImageURL(
      innerImageURL,
      function onComplete(patternFileString) {
        const blob = new Blob([patternFileString], { type: "text/plain" });

        // ストレージへ保存⇒あとで関数化
        // strageFilePath_ARmarker_pattern = user_id + "/" + "ARmarker.patt";
        // const storageRef = ref(firebase.storage,strageFilePath_ARmarker_pattern);
        // // 'file' comes from the Blob or File API
        // uploadBytes(storageRef, blob).then((snapshot) => {
        //   console.log("Uploaded a blob or file!");
        // });
        SetStorage_ARmarker_pattern(patternFileString)

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
  //   var domElement = window.document.createElement("a");
  //   domElement.href = "https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=" + qr_path;
  //   // domElement.href = qr_path;
  //   // domElement.download = qr_path;
  //   domElement.download = "qr-code.png";
  //   document.body.appendChild(domElement);
  //   domElement.click();
  //   document.body.removeChild(domElement);

     let canvas = document.getElementById("canvas_qr");

     let link = document.createElement("a");
     link.href = canvas.toDataURL("image/png");
     link.download = "test.png";
     link.click();


  }

  return (
    <>
      {loading ? (
        <h2>アップロード中・・・</h2>
      ) : (
        <>
          {isUploaded ? (
            <>
              <QRCodeCanvas id = "canvas_qr" value={{qr_path}} />,
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

            </div>
          )}
        </>
      )}
    </>
  );
};


export default MovieUploader;
