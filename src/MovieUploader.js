import { Button } from "@mui/material";
import React, { useState } from "react";
import ImageLogo from "./movie.svg";
import "./MovieUpload.css";
import CircleProgress from "./CircleProgress";
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
        percentage.innerHTML = progress.toFixed() + " %";
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

  return (
    <>
      {loading ? (
        <div id="load-screen">
          <progress max="100" value="0" id="loading"></progress>
          {/* <CircleProgress id="loading" value={0.5} size={100} color="#ff0000" emptyColor="#eee" /> */}
          <h3 id="percentage">0 %</h3>
          <h2 className="nowloading">アップロード中・・・</h2>
        </div>
      ) : (
        <>
          {isUploaded ? (
            <>
              <div id="uploaded-screen">
                <h2 id="result" className="result">
                  <p>アップロード完了しました！</p>
                </h2>
                <p>
                  <Link to={"/marker"} state={{ user_id }}>
                    次へ
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="outerBox">
              <div className="title">
                <h2>動画アップローダー</h2>
                <p>mp4の画像ファイル</p>
              </div>
              <div className="movieUplodeBox">
                <div className="movieLogoAndText">
                  <img src={ImageLogo} alt="imagelogo" />
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
              <Button variant="contained">
                ファイルを選択
                <input
                  className="movieUploadInput"
                  type="file"
                  onChange={OnFileUplodeToFirebase}
                  accept=".mp4"
                />
              </Button>
              <Button variant="contained" onClick={ClickpageToMakeMarker}>
                ページ遷移
              </Button>
              {/* <Link to={{pathname: "/marker"}, state: "テキストだよ"}>
                ページ遷移リンク
              </Link> */}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default MovieUploader;
