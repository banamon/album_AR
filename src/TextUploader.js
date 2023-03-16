import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
// firebase
import firebase from "./firebase";
import {updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes,uploadString} from "firebase/storage";
import "./TextUploader.css";
// ページ遷移
import { Link, useLocation } from "react-router-dom";
// import {useNavigate} from "react-router-dom"


function TextUploader() {
  const [text, setText] = useState("");
  const filename_textimg = "text.png"

  // user_idの取得
  const { state } = useLocation();
  const user_id = state.user_id;
  // const user_id = "TzxJ9ox39PmW84TgS19x";
  console.log("id取得" + user_id);

  const InputText=(inputText)=>{
    setText(inputText);
    drawText(inputText);
    // updateDB_text(text);
  }

  const MakeImgText=()=>{
    var canvas = document.getElementById("preview");
    var png = canvas.toDataURL();
    console.log(png);
    const filepath = user_id + "/" + filename_textimg;
    updateDB_text(text,filepath);
    upload_textimg(png,filepath);

    console.log("ページ遷移");
    // ページ遷移 ARマーカ作成
    // const navigation = useNavigate()
    // navigation('/marker'); // 画面遷移
  }

  // Canvasに文字を描く
  const drawText=(text)=>{
    var canvas = document.getElementById("preview");
    var ctx = canvas.getContext('2d');

    // canvaの初期化
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

	//文字のスタイルを指定
	ctx.font = '32px serif';
	ctx.fillStyle = '#404040';
	//文字の配置を指定（左上基準にしたければtop/leftだが、文字の中心座標を指定するのでcenter
	ctx.textBaseline = 'center';
	ctx.textAlign = 'center';
	//座標を指定して文字を描く（座標は画像の中心に）
	var x = (canvas.width / 2);
	var y = (canvas.height / 2);
	ctx.fillText(text, x, y);
  }


  // DBにARマーカーの情報を格納
  const updateDB_text = async (text,filepath) => {
    // DB登録
    console.log("DB保存開始" + text);
    try {
      const userRef = await updateDoc(doc(firebase.db, "arbum_data", user_id), {
        text: text,
        text_img_path: filepath,
      });
      console.log("保存完了");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // 画像をストレージに保存
  const upload_textimg = (data_url_textimg,filepath) => {
    const storageRef = ref(
      firebase.storage,
      filepath
    );
    uploadString(storageRef, data_url_textimg, 'data_url').then((snapshot) => {
      console.log('Uploaded a data_url string!');
    });
  }

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
    <div id="text-screen">
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
      <img id="step2-progress" src="img/step2-progress.png"/>
      <div id="text-contents">
        <p id="text-ex1">表示させたい</p>
        <p id="text-ex2">文字を入力してください</p>
        {/* <p>{text}</p> */}
        <p><canvas id="preview" style = {{background:'rgba(0,0,0,0)'}} ></canvas></p>
        <input id="text-input" type="text" value={text} onChange={(e) => InputText(e.target.value)}/>
        <Button onClick={MakeImgText} id="next-makemarker">
          <Link to="/marker" state={{ user_id }}><a>決定して次へ</a></Link>
        </Button>
      </div>
    </div>
  );
}

export default TextUploader;
