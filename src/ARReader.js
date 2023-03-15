import React, { useEffect, useState } from "react";
// firebase
import firebase from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, getStorage, getDownloadURL } from "firebase/storage";
import { Cursor } from "react-aframe-ar/dist/primitives";
import { Button } from "@mui/material";
// import { AFRAME } from "aframe-ar";
// import AFRAME from "aframe";
// import arjs from "ar.js";
// import "ar.js";
// import { ARCanvas, ARMarker } from "react-three-arjs"

const ARReader = () => {
  const [loading, setLoading] = useState(false);
  const [rendered, setRendered] = useState(false);

  const storage = getStorage();
  // var user_id = "TzxJ9ox39PmW84TgS19x";
  var user_id = "vhhy6lqOnekfDWBLHmmI";
  console.log("uid取得:" + user_id);

  // var moviefile_path =
  // "https://firebasestorage.googleapis.com/v0/b/test-arbum.appspot.com/o/TzxJ9ox39PmW84TgS19x%2FDebug_sax.mp4?alt=media&token=15f967f7-cae9-48d2-bf1b-a5b46cce5481";
  // https://firebasestorage.googleapis.com/v0/b/test-arbum.appspot.com/o/TzxJ9ox39PmW84TgS19x%2FDebug_sax.mp4?alt=media&token=15f967f7-cae9-48d2-bf1b-a5b46cce5481
  // 動画path（デフォルトを用意）
  const [moviefile_path, setMoviePath] = useState(
    process.env.PUBLIC_URL + "/testsrc/Debug.mp4"
  );
  // パターンファイルpath
  const [markerpatternfile_path, setPattaernPath] = useState(
    process.env.PUBLIC_URL + "/testsrc/pattern-Debugmarker.patt"
  );

  // DB取得予定
  const moveurl = user_id + "/Debug_sax.mp4";
  const patturl = user_id + "/ARmarker.patt";
  if(!loading){
    GetStrage();
  }

  async function GetStrage(){
    console.log("GetStrage");

    // DBへのアクセス



    // 動画の取得
    const FirestoreRef_Movie = ref(storage, moveurl);
    const url_movie = await getDownloadURL(FirestoreRef_Movie)

    // テキスト画像の取得（あとで作成）

    //  パターンファイルの取得
    const FirestoreRef_pattarn = ref(storage, patturl);
    const url_pattarn = await getDownloadURL(FirestoreRef_pattarn)

    console.log(url_movie);
    setMoviePath(url_movie)
    console.log(url_pattarn);
    setPattaernPath(url_pattarn)
    console.log("Storage取得完了");
    console.log(moviefile_path);
    console.log(markerpatternfile_path);
    
    setLoading(true);
  }

  // async function GetDB(){
  //   var paths;

  //   return paths
  // }

  // const FirestoreRef_Movie = ref(storage, moveurl);
  // getDownloadURL(FirestoreRef_Movie)
  //   .then((url) => {
  //     console.log("動画取得: " + url);
  //     setMoviePath(url);
  //     console.log("動画取得完了");
  //     // ViewMoviefromMarker()
  //     setLoading(true);
  //   })
  //   .catch((error) => {
  //     console.err("動画取得ERR: " + error);
  //     // Handle any errors
  //   });

  const DebugVIew_Loading = () => {
    return (
      <div>
        <p>ロード中</p>
      </div>
    );
  };

  
  const DebugVIew = () => {
    return (
      <div>
        <p>オブジェクト</p>
        {/* <>{creatediv()}</> */}
      </div>
    );
  };

  const RecognizeMarker = () => {
    console.log("マーカ発見 eventたぐ");
  };

  useEffect(() => {
    console.log("useEffect呼び出し");
    if (loading) {
      // marker発見時の処理
      const videotag = document.getElementById("video");
      const marker = document.getElementById("marker");
      marker.addEventListener("markerFound", function () {
        console.log("marker発見");
        videotag.play();
      });
    }
  });

  // const creatediv = () =>{
  //   const div = document.createElement('div');
  //   div.className = 'sample';
  //   return div;
  // }

  const ViewMoviefromMarker = () => {
    return (
      <a-scene arjs="sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480; sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640">
        <a-assets timeout="600000">
          <video id="video" src={moviefile_path} preload="auto"></video>
        </a-assets>
        <a-marker
          // markerFound = {RecognizeMarker}
          type="pattern"
          url={markerpatternfile_path}
          marker
          id="marker"
        >
          {/* <a-marker preset="hiro" marker id="marker"> */}
          <a-video
            id="a_video"
            src="#video"
            width="4.6"
            height="4.6"
            position="0 0 0"
            rotation="0 0 0"
          ></a-video>
        </a-marker>
        <a-camera></a-camera>
      </a-scene>
    );
  };

  return (
    <>
      {!loading ? DebugVIew_Loading() : ViewMoviefromMarker()}
      {/* {!loading ? (DebugVIew_Loading()):(DebugVIew())} */}
      {/* {ViewMoviefromMarker()} */}
      {/* {DebugVIew_Loading()} */}
    </>
  );
};

export default ARReader;
