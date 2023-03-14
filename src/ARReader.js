import React, { useState } from "react";
// firebase
import firebase from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, getStorage, getDownloadURL } from "firebase/storage";
import { Cursor } from "react-aframe-ar/dist/primitives";

const ARReader = () => {
  const [loading, setLoading] = useState(false);
  const storage = getStorage();
  var user_id = "TzxJ9ox39PmW84TgS19x";
  console.log("uid取得:" + user_id);

  var moviefile_path = "https://firebasestorage.googleapis.com/v0/b/test-arbum.appspot.com/o/TzxJ9ox39PmW84TgS19x%2FDebug_sax.mp4?alt=media&token=15f967f7-cae9-48d2-bf1b-a5b46cce5481";


  // テスト用
  window.onload = function(){
    const videotag = document.getElementById("movie");
    console.log("ビデオタグ", videotag)
    videotag.src = moviefile_path;
    // videotag.play();

    const markerpatternfile_path = user_id + "/ARmarker.patt";
    const pattRef = ref(storage, markerpatternfile_path);
    const movieRef = ref(storage, moviefile_path);
    console.log("")
    console.log(markerpatternfile_path)
    console.log(moviefile_path)
    console.log(pattRef)
    console.log(movieRef)
    console.log("")

  // getDownloadURL(movieRef).then((url) => {
  //   console.log("getDownloadURL: " + url);
  //   // moviefile_path = url;
  //   // setMoviePath(url)
  //   console.log("DownloadURL取得完了");
  //   videotag.src = url;
  //   // if(videotag !== null){
  //   // }
  //   console.log("videotag", videotag)
  // })
  // .catch((error) => {
  //   console.log("getDowinloadERR");
  //   console.log(error);
  //   // Handle any errors
  // });

    console.log("デバッグコンソール", moviefile_path);
    console.log("アナフィラキシーショック", markerpatternfile_path);
  }

  return (
    <a-scene arjs="sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480; sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640">
      <a-assets timeout="30000">
        <video
          autoPlay
          muted
          id="movie"
          src={moviefile_path}
          loop={true}
          preload="auto"
        ></video>
        <audio id="movie_audio" src={moviefile_path} autoPlay muted></audio>
      </a-assets>

      <a-marker preset="hiro">
      {/* <a-marker type="pattern" url={ markerpatternfile_path }> */}
        {/* <a-sound id="my_sound01" src="#movie_audio" autoplay="true" loop="true"></a-sound> */}
        <a-video
          src="#movie"
          width="4.6"
          height="4.6"
          position="0 0 0"
          rotation="0 0 0"
          play="true"
          autoPlay
        ></a-video>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
};

export default ARReader;