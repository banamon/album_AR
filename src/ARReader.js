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

const ARComponent = () => {
  const [loading, setLoading] = useState(false);
  const [rendered, setRendered] = useState(false);

  const storage = getStorage();
  
    // id取得
  // let url = new URL(window.location.href);
  // let params = url.searchParams;
  // var user_id = params.get("user_id");
  // var user_id = "TzxJ9ox39PmW84TgS19x";
  var user_id = "nyV1lobqqwnu8GFkwiSI";
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
  const [textimgfile_path, setTextimgPath] = useState(
    process.env.PUBLIC_URL + "/testsrc/hiro.jpg"
  );
  const text = "Hello World";

  // DB取得予定
  const moveurl = user_id + "/Debug_sax.mp4";
  const patturl = user_id + "/ARmarker.patt";

  // 最初のみデータの取得
  if(!loading){
    GetData();
  }

  async function GetData(){
    console.log("GetStrage");

    // DBへのアクセス
    console.log("DBアクセス");
    const paths = await GetDB(user_id);
    console.log(paths)

    // 動画の取得
    const FirestoreRef_Movie = ref(storage, paths.movie_path);
    const url_movie = await getDownloadURL(FirestoreRef_Movie)

    // テキスト画像の取得（あとで作成）
    const FirestoreRef_textimg = ref(storage, paths.text_img_path);
    const url_textimg = await getDownloadURL(FirestoreRef_textimg)

    //  パターンファイルの取得
    const FirestoreRef_pattarn = ref(storage, paths.marker_path);
    const url_pattarn = await getDownloadURL(FirestoreRef_pattarn)

    setMoviePath(url_movie)
    setPattaernPath(url_pattarn)
    setTextimgPath(url_textimg)
    console.log("Storage取得完了");
    
    setLoading(true);
  }


  async function GetDB(user_id){
    var paths = {};
    const Doc = await getDoc(doc(firebase.db, "arbum_data", user_id));
    paths.movie_path = Doc.data().movie_path;;
    paths.marker_path = Doc.data().marker_pattern_path;
    paths.text_img_path = Doc.data().text_img_path;
    return paths
  }

  const DebugVIew_Loading = () => {
    return (
      <div>
        <p>ロード中</p>
      </div>

    );
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

  const ViewMoviefromMarker = () => {
    return (
      <a-scene arjs="sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480; sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640">
        <a-assets timeout="600000">
          <video id="video" src={moviefile_path} preload="auto"></video>
          <img id="textimg" src={textimgfile_path}></img>

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
            position="0 0 -1"
            rotation="0 0 0"
          ></a-video>
          <a-image id="a_textimg" src="#textimg" position="0 4 0" scale="3 3 3"></a-image>
        </a-marker>
        <a-camera></a-camera>
      </a-scene>
    );
  };

  const Debug_View_text = () =>{
    console.log("Debug_View_text");
    return (
      <a-scene>
      {/* <a-scene vr-mode-ui="enabled: true" style="position:fixed;top:0;"> */}
      <a-box position="0 1.5 -8" rotation="0 0 0" color="#4CC3D9"></a-box>

      {/* <a-plane position="-1.5 2 -1" width="2" height="0.5" material="shader:html;target: #target1;"></a-plane> */}
  
      <a-entity mb-text position="0 1.5 -2" data-text="さんぷる"></a-entity>
    </a-scene>
    )
  }

  return (
    <>
      {!loading ? DebugVIew_Loading() : ViewMoviefromMarker()}
      {/* {!loading ? (DebugVIew_Loading()):(DebugVIew())} */}
      {/* {ViewMoviefromMarker()} */}
      {/* {DebugVIew_Loading()} */}
    </>

  );
};

export default ARComponent;
