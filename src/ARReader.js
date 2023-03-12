import React, { useEffect, useState } from 'react'
// firebase
import firebase from "./firebase";
import { collection, addDoc, doc, updateDoc ,getDoc} from "firebase/firestore";
import { ref, getStorage, getDownloadURL  } from "firebase/storage";

const ARComponent = () => {  
  // id取得
  // let url = new URL(window.location.href);
  // let params = url.searchParams;
  // console.log(params.get('user_id')); // 5

  // // IDの取得 おそらくGET
  // var user_id = params.get('user_id');
  var user_id = "u3BPqWBMqVbgvnOubQRh";


  // 動画path
  const [moviefile_path, setMoviePath] = useState(process.env.PUBLIC_URL + "/testsrc/Debug.mp4");
  const [markerpatternfile_path, setPattaernPath] = useState(process.env.PUBLIC_URL + "/testsrc/pattern-Debugmarker.patt");

  // const moviefile_path = process.env.PUBLIC_URL + "/testsrc/Debug.mp4";
  // const markerpatternfile_path = process.env.PUBLIC_URL + "/testsrc/pattern-Debugmarker.patt";

  // setMoviePath()
  // setPattaernPath()

  const conectDB = async()=>{
    // DBからpathの取得 非同期処理注意
    console.log("DB取得開始");
    const Doc = await getDoc(doc(firebase.db, "arbum_data", user_id));
    console.log(typeof(Doc));
    console.log(Doc.data().marker_pattern_path);
    console.log(Doc.data().movie_path);
    const DB_marker_pattern_path = Doc.data().marker_pattern_path;
    // const DB_marker_pattern_path = Doc.data().marker_pattern_path_d;
    const DB_movie_path = Doc.data().movie_path;
    console.log("DB取得完了");
    setMoviePath(GetMovie(DB_movie_path))
    setPattaernPath(Getpattern(DB_marker_pattern_path))
  }
  conectDB()


  const GetMovie = (DB_movie_path) =>{
    // pathからStorageにアクセス(今は直接アクセス)
    const storage = getStorage();
    const FirestoreRef_Movie = ref(storage, DB_movie_path);
      getDownloadURL(FirestoreRef_Movie).then((url) => {
      console.log("動画取得: " + url);
      // setMoviePath(url)
      console.log("動画取得完了");
      return url;
    })
    .catch((error) => {
      console.err("動画取得ERR: "+error);
      // Handle any errors
    });
}

const Getpattern = (DB_marker_pattern_path) => {
      const storage = getStorage();
  const FirestoreRef_Pattern = ref(storage, DB_marker_pattern_path);
  getDownloadURL(FirestoreRef_Pattern).then((url) => {
      console.log("patt取得開始" + url);  
      // setPattaernPath(url);
      console.log("patt取得完了" + url);  
      return url;
  })
  .catch((error) => {
    console.err("pattern取得ERR: "+error);
  });
}

  // conectDB();




  // pathからStorageにアクセス(今は直接アクセス)
  // const storage = getStorage();
  // const FirestoreRef_Movie = ref(storage, DB_movie_path);
  //   getDownloadURL(FirestoreRef_Movie).then((url) => {
  //   console.log("動画取得: " + url);
  //   setMoviePath(url)
  //   console.log("動画取得完了");
  // })
  // .catch((error) => {
  //   console.err("動画取得ERR: "+error);
  //   // Handle any errors
  // });

  // const FirestoreRef_Pattern = ref(storage, DB_marker_pattern_path);
  // getDownloadURL(FirestoreRef_Pattern).then((url) => {
  //     console.log("patt取得開始" + url);  
  //     setPattaernPath(url);
  //     console.log("patt取得完了" + url);  
  // })
  // .catch((error) => {
  //   console.err("pattern取得ERR: "+error);
  // });
  

  return (
    <a-scene arjs="sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480; sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640">
    {/* <a-scene embedded arjs>  */}
    {/* <a-scene arjs> */}
      <a-assets timeout="30000">
        <video
          autoPlay
          id="movie"
          src={moviefile_path}
          // loop={true}
          preload="auto"
        ></video>
        {/* <audio src={moviefile_path} autoPlay></audio> */}
      </a-assets>

      {/* <a-marker preset="hiro"> */}
      <a-marker type="pattern" url={ markerpatternfile_path }>
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
};

export default ARComponent;
