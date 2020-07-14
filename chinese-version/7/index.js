
/**
 * 页面逻辑
 * github:https://github.com/eveningwater/vanilla-js-20
 */
function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}
const figurePart = $$('.figure-part');
// console.log(figurePart);

// 需要猜测的单词数组，从这个数组中挑选单词
const words = ["html", 'css', 'javascript', 'vue', 'react', 'typescript'];
const wordInfos = ["超文本标记语言","层叠样式表","开发web页面的脚本语言","是一套用于构建用户界面的渐进式框架","用于构建用户界面的 JavaScript 库","JavaScript的超集"]
// 随机抽选
let selectWord = selectWordRandom();

let isMobile = false;
// 游戏状态
let playStatus = true;
let isShowKeyboard = false;
// 错误字母数组
const wrongLetters = [];
// 正确的字母数组
const correctLetters = [];

let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let keyboardContainer = $('.keyboard-container');
// 获取变量
let wordEl = $('#word');
let wrongEl = $('#wrong-letters');
/**
 * 随机挑选单词
 */
function selectWordRandom() {
    return words[Math.floor(Math.random() * words.length)];
}
/**
 * 显示单词
 */
function displayWord() {
    wordEl.innerHTML = `
        ${
        selectWord.split('').map(l => `
                <span class="letter">${ correctLetters.indexOf(l) > -1 ? l : ''}</span>
            `).join('')
        }
    `;
    const innerWord = wordEl.innerText.replace(/\n/g, "");
    // console.log(innerWord);
    // 如果最后输入的单词与选择的单词相同，则表示已经赢了
    if (innerWord === selectWord) {
        playStatus = false;
        showPopup("恭喜您，您猜对了单词,😃!");
    }
}

function updateWrongLetters() {
    wrongEl.innerHTML = `
        ${
        wrongLetters.map(l => `
                <span>${l}</span>
            `)
        }
    `;

    // 显示小人
    figurePart.forEach((part, index) => {
        let errors = wrongLetters.length;
        if (index < errors) {
            part.style.display = "block";
        } else {
            part.style.display = "none";
        }
    });

    // 游戏失败
    if (wrongLetters.length === figurePart.length) {
        playStatus = false;
        showPopup("很遗憾，您猜错了单词，😕！");
    }
}
function showPopup(message) {
    return ewConfirm({
        title: "温馨提示",
        content: message,
        footerAlign: "center",
        sureText: "再玩一次",
        showCancel: false,
        isClickModal: false,
        sure: (context) => {
            context.close(600);
            playStatus = true;
            // 清空数组
            wrongLetters.splice(0);
            correctLetters.splice(0);
            selectWord = selectWordRandom();
            displayWord();
            updateWrongLetters();
            $('#confirm-text').innerHTML = "";
        }
    });
}

function showNotification() {
    return $message.error("您已经按下过这个字母了!");
}
function eventHandle(letter) {
    if (selectWord.indexOf(letter) > -1) {
        if (correctLetters.indexOf(letter) > -1) {
            showNotification();
        } else {
            correctLetters.push(letter);
            displayWord();
        }
    } else {
        if (wrongLetters.indexOf(letter) > -1) {
            showNotification();
        } else {
            wrongLetters.push(letter);
            updateWrongLetters();
        }
    }
}
function openMobileKeyboard(){
    isShowKeyboard = !isShowKeyboard;
    keyboardContainer.style.display = isShowKeyboard ? "block" : 'none';
    this.innerHTML = isShowKeyboard ? '关闭虚拟键盘' : "开启虚拟键盘";
}
window.onload = function () {
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) isMobile = true;
    $('#seeConfirm').addEventListener('click',function () { 
        $('#confirm-text').innerHTML = wordInfos[words.indexOf(selectWord)];
     })
    if (!isMobile) {
        window.addEventListener('keydown', (e) => {
            if (playStatus) {
                // 字母键的keyCode值在65到90之间
                if (e.keyCode >= 65 && e.keyCode <= 90) {
                    let letter = e.key.toLowerCase();
                    eventHandle(letter);
                }
            }
        })
    } else {
        $("#keyboard").style.display = "block";
        keyboardContainer.innerHTML = "";
        $("#openKeyboard").addEventListener('click',openMobileKeyboard);
        letters.split("").forEach((item) => {
            let button = document.createElement("button");
            button.innerHTML = item;
            keyboardContainer.appendChild(button)
        });
        [].slice.call(keyboardContainer.children).map((btn) => {
            btn.addEventListener('click', function () {
                eventHandle(this.innerHTML.toLowerCase());
            })
        })
    }
    displayWord();
}


