# ARバムめーかー

## システム概要
大学4年生の時に
[Open Hack U 2022 Spring OSAKA](https://hacku.yahoo.co.jp/hacku2022spring_osaka/)
に2人で参加した際に開発したWebアプリです．

大学4年生で卒業シーズンだったのもあり，思い出を残すものとして，卒業アルバムや手紙などの紙媒体により鮮明な思い出を残せるように，AR技術を用いて動画を表示するWebアプリを開発しました．

システムリンク：[ARバムめーかー](https://arbummaker.web.app/)

使用技術
- React
- A-Flame
- AR.js
- Firebase
- FireStore

## システム機能
### 表示コンテンツ作成
ARで表示したい動画のアップロードと，コメントを入力します．
また，利用したいデザインのARマーカを選択すると，ARマーカと，AR表示ためのQRコードが発行されます．

### AR表示
ARマーカとQRコードを張り付けた紙媒体に対し，まず，QRコードから読み取りサイトを開きます．

その後，起動したカメラでARマーカを読み込むことで，動画やコメントを確認することが出来ます

## システム画面
### 表示コンテンツ投稿画面
![ARコンテンツ投稿画面](https://github.com/banamon/album_AR/assets/120772851/e98793a5-e402-4e1a-9f73-b20c048d48a6)

### AR表示画面例
![ARbamu](https://github.com/banamon/album_AR/assets/120772851/2bec126a-9c78-4e52-9e68-68a28628f7db)

