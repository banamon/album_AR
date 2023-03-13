import React, { useState } from "react";
// firebase
import firebase from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, getStorage, getDownloadURL } from "firebase/storage";

const ARComponent = () => {
  const [loading, setLoading] = useState(false);
  const videotag = document.getElementById("video");


  // id取得
  // let url = new URL(window.location.href);
  // let params = url.searchParams;
  // var user_id = params.get("user_id");
  var user_id = "TzxJ9ox39PmW84TgS19x";
  console.log("uid取得:" + user_id);

  // 動画path（デフォルトを用意）
  const [moviefile_path, setMoviePath] = useState(
    process.env.PUBLIC_URL + "/testsrc/Debug.mp4"
  );
  // パターンファイルpath
  const [markerpatternfile_path, setPattaernPath] = useState(
    process.env.PUBLIC_URL + "/testsrc/pattern-Debugmarker.patt"
  );

  const conectDB = async () => {
    // DBからpathの取得 非同期処理注意
    console.log("DB取得開始");
    const Doc = await getDoc(doc(firebase.db, "arbum_data", user_id));
    console.log(typeof Doc);
    console.log(Doc.data().marker_pattern_path);
    console.log(Doc.data().movie_path);
    const DB_marker_pattern_path = Doc.data().marker_pattern_path;
    const DB_movie_path = Doc.data().movie_path;
    console.log("DB取得完了");
    setMoviePath(GetMovie(DB_movie_path));
    setPattaernPath(Getpattern(DB_marker_pattern_path));

    // loading画面終了（この処理をDB取得完了時ではなく，a-frame作り終わったタイミングでしたい
    setLoading(true);
    console.log("loading完了");
  };
  
  conectDB();

  const GetMovie = (DB_movie_path) => {
    // pathからStorageにアクセス(今は直接アクセス)
    const storage = getStorage();
    const FirestoreRef_Movie = ref(storage, DB_movie_path);
    getDownloadURL(FirestoreRef_Movie)
      .then((url) => {
        console.log("動画取得: " + url);
        // setMoviePath(url)
        console.log("動画取得完了");
        videotag.src = url;
        return url;
      })
      .catch((error) => {
        console.err("動画取得ERR: " + error);
        // Handle any errors
      });
  };

  const Getpattern = (DB_marker_pattern_path) => {
    const storage = getStorage();
    const FirestoreRef_Pattern = ref(storage, DB_marker_pattern_path);
    getDownloadURL(FirestoreRef_Pattern)
      .then((url) => {
        console.log("patt取得開始" + url);
        // setPattaernPath(url);
        console.log("patt取得完了" + url);
        return url;
      })
      .catch((error) => {
        console.err("pattern取得ERR: " + error);
      });
  };

  const Viewloading=()=>{
    return(
      <p>Loadingテスト</p>
    );
  }

  const ViewAR=()=>{
    return (
      <a-scene arjs="sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480; sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640">
      <a-assets timeout="600000">
        <video
          autoPlay
          id="video"
          src={moviefile_path}
          // loop={true}
          preload="auto"
        ></video>
        {/* <audio src={moviefile_path} autoPlay></audio> */}
      </a-assets>

      {/* <a-marker preset="hiro"> */}
      <a-marker type="pattern" url={markerpatternfile_path}>
        <a-video
          src="#movie"
          width="4.6"
          height="4.6"
          position="0 0 0"
          rotation="0 0 0"
          play="true"
        ></a-video>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
  }

  return (
    // <>
    //   {!loading ? (Viewloading()):(ViewAR())}
    // </>
    ViewAR()
    // Viewloading()
  );
};

export default ARComponent;
