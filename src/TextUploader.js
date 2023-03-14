import { Button } from "@mui/material";
import React, { useState } from "react";
// firebase
import firebase from "./firebase";
import {updateDoc, doc } from "firebase/firestore";
// ページ遷移
import { Link } from "react-router-dom";

function TextUploader() {
  const [text, setText] = useState("");

  // user_idの取得
  // const { state } = useLocation();
  // const user_id = state.user_id;
  const user_id = "TzxJ9ox39PmW84TgS19x";
  console.log("id取得" + user_id);

  const InputText=()=>{
    console.log(text);
    updateDB_text(text);
  }
  // DBにARマーカーの情報を格納
  const updateDB_text = async (text) => {
    // DB登録
    console.log("DB保存開始" + text);
    try {
      const userRef = await updateDoc(doc(firebase.db, "arbum_data", user_id), {
        text: text,
      });
      console.log("保存完了");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <p>テキスト投稿</p>
      <p>{text}</p>
      <input type="text" value={text} onChange={(event) => setText(event.target.value)}/>
      <Button onClick={InputText}>決定</Button>
    </div>
  );
}

export default TextUploader;
