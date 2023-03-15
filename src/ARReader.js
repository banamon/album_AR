import React, { useState } from "react";
// firebase
import firebase from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, getStorage, getDownloadURL } from "firebase/storage";

const ARComponent = () => {
  const [loading, setLoading] = useState(false);
  const videotag = document.getElementById("video");

  // id取得
  let url = new URL(window.location.href);
  let params = url.searchParams;
  var user_id = params.get("user_id");
  // var user_id = "TzxJ9ox39PmW84TgS19x";
  console.log("uid取得:" + user_id);

  // 動画path（デフォルトを用意）
  const [moviefile_path, setMoviePath] = useState(
    process.env.PUBLIC_URL + "/testsrc/Debug.mp4"
  );
  // パターンファイルpath
  const [markerpatternfile_path, setPattaernPath] = useState(
    process.env.PUBLIC_URL + "/testsrc/pattern-Debugmarker.patt"
  );
  const text = "Hello World";

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

  const aframeMutlByte = () =>{
    console.log("aframeMutlByte");
    document.querySelectorAll('[mb-text]:empty').forEach(mb_text=>{
      console.log(mb_text.dataset.text)
      const text  =mb_text.dataset.text
      const text_cnt = text.length
      const width = text_cnt*1.4
      const height= 1.6
      let cvs = document.createElement('canvas')
      let ctx = cvs.getContext('2d')
      cvs.width = width*100
      cvs.height = height*100
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.font = '100pt Arial'
      ctx.fillText(text,0,125)

      const base64 = cvs.toDataURL("image/png")
      mb_text.innerHTML=`<a-image scale="${(width)/10} ${height/10} 1" src="${base64}"></a-image>`
    })  
  }
    aframeMutlByte();


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
    // <>
    //   {!loading ? (Viewloading()):(ViewAR())}
    // </>
    // ViewAR()
    // Viewloading()
    Debug_View_text()
  );
};

export default ARComponent;
