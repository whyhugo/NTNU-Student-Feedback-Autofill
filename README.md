# NTNU Student Courses Feedback Questionnaire Autofill Extension

一個能幫你快速完成臺師大期末課程意見回饋的瀏覽器 Extension，讓你從重複的點擊中解放，省下寶貴的時間！

![擴充功能預覽](demo.png)

## About The Project

每到期末，教學意見調查總是讓人感到厭煩。數十個科目幾乎一樣的選項，整個過程既耗時又乏味。

這是一個輕巧的瀏覽器擴充功能，它會在課程評鑑頁面提供一個簡潔的控制面板，只需一鍵，即可根據你的選擇（全部滿意或全部不滿意）自動填寫所有必填欄位，包括那些隱藏在彈出視窗中的「詳細原因」。

## Features

* 🚀 **一鍵完成**：只提供「全部填寫非常符合」的選項。
* 🤖 **輕鬆填答**：
    * 自動將「學習自評」設定為「非常符合」與「無缺席」。
    * 自動勾選所有對應的「詳細原因」複選框。
    * 自動根據你的選擇，在建議欄填上有趣的回饋意見文字。
* 🎚️ **滑桿自訂**：根據滑桿選擇自動填寫課程意見調查，可以一次全選 1 到 5 分的評分。
* 🪟 **免開新分頁**：支援 iframe 穿透，可直接在校務系統頁面內操作，無須再另外於新分頁開啟問卷。
* 🌐 **兼容主流瀏覽器**: 支援 Chrome、Edge、Firefox 等主流瀏覽器。

## Getting Started

1.  **下載專案**
    * 你可以 `git clone https://github.com/whyhugo/NTNU-Student-Feedback-Autofill.git`
    * 或者直接點擊此 Repo 右下角的 `Releases`，選擇最新的版本 Download `Source code (.zip)`，然後解壓縮。

2.  **開啟瀏覽器擴充功能頁面**
    * **Chrome**: 在網址列輸入 `chrome://extensions`
    * **Edge**: 在網址列輸入 `edge://extensions`
    * **Firefox**: 在網址列輸入 `about:debugging#/runtime/this-firefox`

3.  **啟用開發人員模式**
    * **Chrome / Edge**: 在頁面的**右上角**，找到並<b>開啟「開發人員模式 (Developer mode)」</b>的開關。
    * **Firefox**: 不需要開啟開發人員模式，直接使用「載入暫時附加元件」。

4.  **載入擴充功能**
    * **Chrome / Edge**: 點擊頁面左上角出現的<b>「載入未封裝項目 (Load unpacked)」</b>按鈕，選擇你剛剛下載並解壓縮的**整個專案資料夾**。
    * **Firefox**: 點擊<b>「載入暫時附加元件 (Load Temporary Add-on)」</b>，選擇專案資料夾中的 `manifest.json`。

5.  **完成！**
    * 如果沒有錯誤，你應該能在瀏覽器的工具列上看到這個擴充功能的圖示。
    * 也可以在你的瀏覽器工具列 icon 當中，開啟擴充功能列表來將此工具釘選，方便下一次使用。 

## Usage

1. 進入師大學生教務系統 → 點選「期末課程意見調查登錄」
2. 點入任一科目問卷（已支援 iframe 穿透，無須再另外於新分頁開啟）
3. 點擊瀏覽器工具列上的擴充功能圖示
4. 根據需求進行選擇
5. 自動填寫完成！（提示訊息會直接顯示在擴充功能畫面下方）
6. 按下頁面上的「提交表單」按鈕。

## Contributing

Contributions are always welcome! Feel free to open an issue or submit a pull request.
