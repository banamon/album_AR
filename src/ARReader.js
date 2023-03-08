import React, { useEffect, useState } from 'react'
// firebase
import firebase from "./firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { ref, getStorage, getDownloadURL  } from "firebase/storage";

const ARComponent = () => {
  const videotag = document.getElementById("video");
  
  // id取得
  // let url = new URL(window.location.href);
  // let params = url.searchParams;
  // console.log(params.get('user_id')); // 5


  const markerpatternfile_path = process.env.PUBLIC_URL + "/testsrc/pattern-Debugmarker.patt";

  // 動画path
  // var moviefile_path = process.env.PUBLIC_URL + "/testsrc/test.jpg";
  // var moviefile_path = process.env.PUBLIC_URL + "/testsrc/Debug.mp4";
  // var moviefile_path = "https://firebasestorage.googleapis.com/v0/b/test-arbum.appspot.com/o/3SFzC76qlfq9yO264F6G%2Fsample.mp4?alt=media&token=1accee60-21a8-4dc7-a4ed-839c2a0d57aa";
  // const moviefile_path = process.env.PUBLIC_URL + "/testsrc/Debug.mp4";
  const [moviefile_path, setMoviePath] = useState(process.env.PUBLIC_URL + "/testsrc/Debug.mp4");



  // IDの取得 おそらくGET

  // DBからpathの取得 非同期処理注意

  // pathからStorageにアクセス(今は直接アクセス)
  const storage = getStorage();
  const forestRef = ref(storage, "3SFzC76qlfq9yO264F6G/sample.mp4");

    getDownloadURL(forestRef).then((url) => {
    console.log("getDownloadURL: " + url);
    // moviefile_path = url;
    setMoviePath(url)
    console.log("DownloadURL取得完了");
    videotag.src = url;
  })
  .catch((error) => {
    console.log("getDowinloadERR");
    console.log(error);
    // Handle any errors
  });

  console.log(moviefile_path);
  console.log(markerpatternfile_path);

  return (
    <a-scene arjs="sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480; sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640">
      <a-assets timeout="30000">
        {/* <img
          id="movie"
          src={moviefile_path}
        ></img> */}
        <video
          autoPlay
          id="movie"
          src={moviefile_path}
          loop={true}
          preload="auto"
        ></video>
        {/* <audio src={moviefile_path} autoPlay></audio> */}
      </a-assets>

      <a-marker preset="hiro">
      {/* <a-marker type="pattern" url={ markerpatternfile_path }> */}
        {/* <a-img
          src="#movie"
          // src={moviefile_path}
          width="4.6"
          height="4.6"
          position="0 0 0"
          rotation="0 0 0"
        ></a-img> */}
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
