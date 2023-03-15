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
  var user_id = "TzxJ9ox39PmW84TgS19x";
  console.log("uid取得:" + user_id);

  var moviefile_path =
    "https://firebasestorage.googleapis.com/v0/b/test-arbum.appspot.com/o/TzxJ9ox39PmW84TgS19x%2FDebug_sax.mp4?alt=media&token=15f967f7-cae9-48d2-bf1b-a5b46cce5481";

  // テスト用
  window.onload = function () {
    console.log("window.onload開始");
    const videotag = document.getElementById("video");
    const a_videotag = document.getElementById("a_video");
    console.log("video", videotag);
    console.log("a-video", a_videotag);
    // videotag.src = moviefile_path;
    // videotag.play();
    // a_videotag.play();

    const btn01 = document.getElementById("my_btn01");
    console.log(btn01);
    btn01.addEventListener("click", (e) => {
      console.log("click");
      videotag.play();
      // a_videotag.play();
    });

    const marker = document.getElementById("marker");
            marker.addEventListener('markerFound', function () {
              console.log("marker発見");
              videotag.play();
            });    

    console.log("デバッグコンソール", moviefile_path);
  };

  const ClickBtn = () => {
    console.log("click");
  };

  const DebugSence = () => {
    return (
      <a-scene embeded arjs>
        <a-box color="#0095DD" position="0 1 -4" rotation="0 0 0"></a-box>
        <a-entity camera></a-entity>
        {/* <a-entity camera look-controls position="0 2 0"></a-entity> */}
      </a-scene>
    );
  };

  const ViewMovie = () => {
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
        </a-assets>
        <a-box color="#0011DD" position="0 1 -4" rotation="0 0 0"></a-box>

        <a-video
          id="a_video"
          src="#video"
          width="4.6"
          height="4.6"
          position="0 1 -8"
          rotation="0 0 0"
          autoPlay
        ></a-video>
        <a-entity
          id="button"
          click-change
          geometry="primitive: ring; radiusInner: 0.75; radiusOuter: 0.8"
          material="color: white; side: double;"
          raycaster="objects: .clickable"
        ></a-entity>

        {/* <a-entity camera>
          <a-cursor></a-cursor>
        </a-entity> */}
        <a-image
          id="my_btn01"
          src={`${process.env.PUBLIC_URL}/testsrc/test.jpg`}
          position="0 1.2 -3"
          scale="0.3 0.3 0.3"
        ></a-image>
        <a-camera>
          <a-cursor></a-cursor>
        </a-camera>
      </a-scene>
    );
  };

  const ViewMoviefromMarker = () => {
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
        </a-assets>
        <a-marker preset="hiro" marker id="marker">
        {/* <a-marker preset="hiro"> */}
          {/* <a-box color="#0011DD" position="0 0 0" rotation="0 0 0"></a-box> */}
          <a-video
            id="a_video"
            src="#video"
            width="4.6"
            height="4.6"
            position="0 0 0"
            rotation="0 0 0"
            autoPlay
          ></a-video>
        </a-marker>
          <a-image
            id="my_btn01"
            src={`${process.env.PUBLIC_URL}/testsrc/test.jpg`}
            position="0 1.2 -3"
            scale="0.3 0.3 0.3"
          ></a-image>
        <a-camera>
          <a-cursor></a-cursor>
        </a-camera>
      </a-scene>
    );
  };

  return (
    // DebugSence()
    // ViewMovie()
    ViewMoviefromMarker()
  );
};

export default ARReader;
