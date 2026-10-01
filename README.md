# TQC App Inventor 2 基礎程式語法練習網站

## 功能
- 首頁可選「第 1-35 題」或「第 36-70 題」。
- 每組固定 35 題。
- 第一次必須完成 35 題後才顯示成績與正確率。
- 第一次答錯的題目會進入「錯題訂正」。
- 錯題訂正會把第一次答錯的題目再作答一次，完成後顯示訂正結果。
- 支援單選題與複選題（第 3、4、42 題）。
- 題目圖片取自原始 PDF，答案依提供的 Google 表單回覆 Excel 設定。

## GitHub Pages 發布
1. 在 GitHub 建立一個新的 repository，例如 `tqc-appinventor-practice`。
2. 將本資料夾全部內容上傳到 repository 根目錄。
3. 到 repository 的 `Settings` -> `Pages`。
4. `Build and deployment` 選 `Deploy from a branch`。
5. Branch 選 `main`，資料夾選 `/(root)`，按 `Save`。
6. 等待 GitHub Pages 部署完成後，即可將網址提供給學生。

## 檔案
- `index.html`：首頁與測驗版面
- `style.css`：網站樣式
- `app.js`：作答、計分、錯題訂正流程
- `questions.js`：70 題答案設定
- `assets/`：70 題題目圖片
