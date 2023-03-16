import React, { useEffect, useState } from "react";
// firebase
import firebase from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, getStorage, getDownloadURL } from "firebase/storage";
import { Cursor } from "react-aframe-ar/dist/primitives";
import { Button } from "@mui/material";


const ARComponent = () => {
  const [loading, setLoading] = useState(false);
  const [rendered, setRendered] = useState(false);

  const storage = getStorage();
  
  // id取得
  let url = new URL(window.location.href);
  let params = url.searchParams;
  var user_id = params.get("user_id");
  // var user_id = "TzxJ9ox39PmW84TgS19x";
  // var user_id = "nyV1lobqqwnu8GFkwiSI";
  console.log("uid取得:" + user_id);

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
    // const FirestoreRef_pattarn = ref(storage, paths.marker_path);
    // const url_pattarn = await getDownloadURL(FirestoreRef_pattarn)
    const url_pattarn = process.env.PUBLIC_URL + "/defaultAR/pattern-"+paths.marker_id+".patt"

    setMoviePath(url_movie)
    setPattaernPath(url_pattarn)
    setTextimgPath(url_textimg)
    console.log("Storage取得完了");
    
    setLoading(true);
  }


  async function GetDB(user_id){
    var paths = {};
    const Doc = await getDoc(doc(firebase.db, "arbum_data", user_id));
    paths.movie_path = Doc.data().movie_path;
    // paths.marker_path = Doc.data().marker_pattern_path;
    paths.text_img_path = Doc.data().text_img_path;
    paths.marker_id = Doc.data().marker_id;
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

      // マーカーを見失ったイベントの登録
      marker.addEventListener('markerLost', function () {
        console.log("marker消失");
        // マーカー認識が外れたら、、ビデオ停止
        videotag.pause();
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
          <a-image id="a_textimg" src="#textimg" position="0 3 0" scale="3 3 3"></a-image>
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

export default ARComponent;
