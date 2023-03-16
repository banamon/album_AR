import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
// firebase
import firebase from "./firebase";
import { updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, uploadString } from "firebase/storage";
// ページ遷移
import { Link, useLocation } from "react-router-dom";
import { borderRadius } from "@mui/system";
// import {useNavigate} from "react-router-dom"

function TextUploader() {
  const [text, setText] = useState("おめでとう！");
  const filename_textimg = "text.png";
  const maxcharnum = 20;

  const fontcolors = [
    {fill: `#FF8383`, stroke: `#FFDDDD`},
    {fill: `#ffffff`, stroke: `#FF8383`},
    {fill: `#A63A3A`, stroke: `#FFDDDD`},
  ]
  const [selectedfontcolors_index, setFontColorindex] = useState(0);
  console.log(fontcolors);

  // user_idの取得
  // const { state } = useLocation();
  // const user_id = state.user_id;
  const user_id = "TzxJ9ox39PmW84TgS19x";
  console.log("id取得" + user_id);

  const InputText = (inputText) => {
    setText(inputText);
    drawText(inputText);
    // updateDB_text(text);
  };

  const MakeImgText = () => {
    var canvas = document.getElementById("preview");
    var png = canvas.toDataURL();
    console.log(png);
    const filepath = user_id + "/" + filename_textimg;
    updateDB_text(text, filepath);
    upload_textimg(png, filepath);
  };

  const NoMakeImgText = () => {
    // 本当は文字なしの場合の処理書くべきだけど，どうせ透明だしいいかな．．．
    drawText("");

    var canvas = document.getElementById("preview");
    var png = canvas.toDataURL();
    console.log(png);
    const filepath = user_id + "/" + filename_textimg;
    updateDB_text(text, filepath);
    upload_textimg(png, filepath);
  };

  // Canvasに文字を描く
  const drawText = (text) => {
    // デバッグ
    var fillcolor = fontcolors[selectedfontcolors_index].fill;
    var strokecolor = fontcolors[selectedfontcolors_index].stroke;
    // var fillcolor = "#00FFFF";
    // var strokecolor = "#FF0000	";
    // var fonts = [ 'serif','Segoe Print', 'san-serif', 'ＭＳ 明朝',"fantasy"];
    var fonts_index = 1;

    var canvas = document.getElementById("preview");
    var ctx = canvas.getContext("2d");

    // canvaの初期化
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    //座標を指定して文字を描く（座標は画像の中心に）
    var x = canvas.width / 2;
    var y = canvas.height / 2;

    //文字のスタイルを指定
    // ctx.font = "48px bold " + fonts[fonts_index];
    ctx.font = "bold 48px 'Segoe Print', san-serif";
    ctx.strokeStyle = strokecolor;
    ctx.lineWidth = "13";
    ctx.textBaseline = "center";
    ctx.textAlign = "center";
    ctx.strokeText(text, x, y);

    // もう少し太字にした
    // // ctx.strokeStyle = strokecolor;
    // ctx.strokeStyle = fillcolor;
    // ctx.lineWidth = "8";
    // ctx.textBaseline = "center";
    // ctx.textAlign = "center";
    // ctx.strokeText(text, x, y);
    
    //文字のスタイルを指定
    // ctx.font = "48px bold";
    ctx.fillStyle = fillcolor;
    ctx.textBaseline = "center";
    ctx.textAlign = "center";
    ctx.lineWidth = "3";
    ctx.fillText(text, x, y);
    
  };

  useEffect(() => {
    // defaultのテキストを描写
    drawText(text);
  })


  // DBにARマーカーの情報を格納
  const updateDB_text = async (text, filepath) => {
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
  const upload_textimg = (data_url_textimg, filepath) => {
    const storageRef = ref(firebase.storage, filepath);
    uploadString(storageRef, data_url_textimg, "data_url").then((snapshot) => {
      console.log("Uploaded a data_url string!");
    });
  };

  const noradio = {
    display: 'none'
  };

    // 選択したときのスタイル
  const checkDefaultARmakerstyle = (value) => {
    if(value == selectedfontcolors_index){
      return {
        border:'3px solid #000'
      }
    }else{
      return {
        border:'none'
      }
    }
  }

    // ラジオボタンの値がチェンジされた時
  const handleChange = (e) => {
    console.log("fontを入れる" + e.target.value);
    setFontColorindex(e.target.value);
  };

  const fontcolor_boxstyle = (colors) => {
    return {
      width: "30px",
      height: "30px",
      background: colors.fill,
      border: "8px solid " + colors.stroke,
      borderRadius: "20%"
    }
  }

  return (
    <div>
      <p>テキスト投稿({maxcharnum}文字以内)</p>
        <canvas id="preview" width="600" height="200" style={{ background: "rgba(0,0,0,0)", border: "1px solid black" }}></canvas>
      <input
        type="text"
        value={text}
        onChange={(e) => InputText(e.target.value)}
        maxLength={maxcharnum}
      />
      <div>
        <p>文字の色</p>
        {fontcolors.map((colors,index)=>(
          <label key={index}>
            {/* <>{console.log(index)}</> */}
            <input type="radio" name="fontColor" value={index} id={"fontcolor_" + index} style={noradio} onChange={handleChange} checked={index === selectedfontcolors_index}/>
            <div className="coloroptionbox" style={fontcolor_boxstyle(colors)}></div>
          </label>
        ))}
      </div>
      <Button onClick={MakeImgText}>
        <Link to={"/marker"} state={{ user_id }}>
          決定
        </Link>
      </Button>
      <Button onClick={NoMakeImgText}>
        <Link to={"/marker"} state={{ user_id }}>
          文字無し
        </Link>
      </Button>
    </div>
  );
}

export default TextUploader;
