import { Button } from "@mui/material";
import React, { useState } from "react";
import ImageLogo from "./movie.svg";
import "./MovieUpload.css";
// firebase
import firebase from "./firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";
// ページ遷移
import { Link } from "react-router-dom";

function MovieUploader() {
  const [loading, setLoading] = useState(false);
  const [isUploaded, setUploaded] = useState(false);
  var [user_id, setuse_id] = useState("hogehgoe");
  // var user_id = "hogehoge";
  var movie_path = "";


  const OnFileUplodeToFirebase = async (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];

    // DB登録
    try {
      const docRef = await addDoc(collection(firebase.db, "arbum_data"), {});
      setuse_id(docRef.id);
      movie_path = docRef.id + "/" + file.name;
      const userRef = await updateDoc(
        doc(firebase.db, "arbum_data", docRef.id),
        {
          movie_path: movie_path,
        }
      );
      upload(movie_path, file);

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  function upload(movie_path, file) {
    console.log("動画保存開始 movie_path" + movie_path);
    const storageRef = ref(firebase.storage, movie_path);
    const uploadMovie = uploadBytesResumable(storageRef, file);

    uploadMovie.on(
      "state_change",
      (snapshot) => {
        setLoading(true);
        // setInterval(() => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        var loading = document.getElementById("loading");
        var percentage = document.getElementById("percentage");
        loading.value = progress;
        console.log(
          "<progress max= 100" + " value=" + progress + "></progress>"
        );
        percentage.innerHTML = progress.toFixed();
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        setLoading(false);
        setUploaded(true);
        console.log("user_id" + user_id);
        // var user_id = file.lastModified;
        // console.log(file);
        // var result = document.getElementById("result");
        // let qrValue = "https://" + user_id;
        // document.getElementById("qr-code").src =
        //   "https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=" +
        //   qrValue;
      }
    );
  }

  // DB保存
  // const InsertDB_movie_path = async (movie_path) => {
  //   console.log("動画のパス入力" + movie_path);
  //   try {
  //     const docRef = await addDoc(collection(firebase.db, "arbum_data"), {
  //       movie_path: movie_path,
  //     });
  //     console.log("Document written with ID: ", docRef.id);
  //     id = docRef.id;
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // };

  const ClickpageToMakeMarker = (e) => {
    console.log("click");
    // const history = useHistory()

    // history.push({
    //   pathname: '/marker',
    //   state: { text: "test" }
    // });

    // this.props.history.push({
    //   pathname: "/maeker",
    //   state: { text: "test" },
    // });
  };
  window.onload = function(){
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");

    console.log(navLinks)

    burger.addEventListener("click", () => {
      nav.classList.toggle("nav-active");

      navLinks.forEach((link, index) => {
        if(link.style.animation) {
          link.style.animation = "";
        } else {
          link.style.animation = `navlinksFade 0.5s ease forwards ${index / 7+0.4}s`;
          console.log("index", index);
        }
      });
      burger.classList.toggle("toggle");
    });
  }

  return (
    <>
      {loading ? (
        <div id="load-screen">
          <nav>
            <div className="logo">
              <img id="logo-img" src="img/app_icon_v2.png"/>
              <h4 id="nav_title">ARバムめーかー</h4>
            </div>
            <ul className="nav-links">
              <li><a href="#center_ex2">動画投稿</a></li>
              <li><a href="#step1_ex4">文字投稿</a></li>
              <li><a href="#step2_ex4">マーカー作成</a></li>
              <li><a href="#step5_ex4">使い方</a></li>
            </ul>
            <div className="burger">
              <div className="line1"></div>
              <div className="line2"></div>
              <div className="line3"></div>
            </div>
          </nav>
          <img id="step1-progress" src="img/step1-progress.png"/>
          <div id="load-contents">
            <p id="nowloading">Now Loading...</p>
            <progress max="100" value="0" id="loading"></progress>
            <p id="percentage">0</p>
            <p id="percent">%</p>
            {/* <h2 className="nowloading">アップロード中・・・</h2> */}
          </div>
        </div>
      ) : (
        <>
          {isUploaded ? (
            <div id="uploaded-screen">
              <nav>
                <div className="logo">
                  <img id="logo-img" src="img/app_icon_v2.png"/>
                  <h4 id="nav_title">ARバムめーかー</h4>
                </div>
                <ul className="nav-links">
                  <li><a href="#center_ex2">動画投稿</a></li>
                  <li><a href="#step1_ex4">文字投稿</a></li>
                  <li><a href="#step2_ex4">マーカー作成</a></li>
                  <li><a href="#step5_ex4">使い方</a></li>
                </ul>
                <div className="burger">
                  <div className="line1"></div>
                  <div className="line2"></div>
                  <div className="line3"></div>
                </div>
              </nav>
              <img id="step1-progress" src="img/step1-progress.png"/>
              <div id="comp-contents">
                  <p id="comp-en">completed！</p>
                  <p id="comp-jp">アップロード完了しました</p>
                  <p><Link to="/text" state={{ user_id }}><button className="next-litter" ><a>文字の入力へ</a></button></Link></p>
              </div>
            </div>
          ) : (
            <div id="screen">
              <nav>
                <div className="logo">
                  <img id="logo-img" src="img/app_icon_v2.png"/>
                  <h4 id="nav_title">ARバムめーかー</h4>
                </div>
                <ul className="nav-links">
                  <li><a href="#center_ex2">動画投稿</a></li>
                  <li><a href="#step1_ex4">文字投稿</a></li>
                  <li><a href="#step2_ex4">マーカー作成</a></li>
                  <li><a href="#step5_ex4">使い方</a></li>
                </ul>
                <div className="burger">
                  <div className="line1"></div>
                  <div className="line2"></div>
                  <div className="line3"></div>
                </div>
              </nav>
              <img id="step1-progress" src="img/step1-progress.png"/>
              <p id="step1-ex1">表示したい動画を</p>
              <p id="step1-ex2">アップロードしてください</p>
              <div className="outerBox">
                <div className="title">
                  <h2>動画の選択</h2>
                  <p>mp4の画像ファイル</p>
                </div>
                <div className="movieUplodeBox">
                  <div className="movieLogoAndText">
                    <img src="img/step1.png" alt="imagelogo" />
                    <p>ここにドラッグ＆ドロップしてください</p>
                  </div>
                  <input
                    className="movieUploadInput"
                    multiple
                    name="movieURL"
                    type="file"
                    accept=".mp4"
                    onChange={OnFileUplodeToFirebase}
                  />
                </div>
                <p>または</p>
                <Button id="choice-button" variant="contained">
                  ファイルを選択
                  <input
                    className="movieUploadInput"
                    type="file"
                    onChange={OnFileUplodeToFirebase}
                    accept=".mp4"
                  />
                </Button>
                {/* <Button variant="contained" onClick={ClickpageToMakeMarker}>
                  ページ遷移
                </Button> */}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default MovieUploader;
