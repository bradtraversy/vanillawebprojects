function $(selector) {
    return document.querySelector(selector);
}
const msgEl = document.getElementById('msg');
let randomNumber = getRandomNumber();
console.log('数字是:', randomNumber);

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();
recognition.start();
// console.log(recognition);
function onSpeak(e) {
    // console.log(e);
    let msg = e.results[0][0].transcript;

    writeMessage(msg);
    checkMessage(msg);
}
function writeMessage(msg) {
    return $("#msg .box").innerHTML = msg;
}
function checkMessage(msg) {
    let num = +msg;
    if (isNaN(num)) {
        setMsg("您说的不是一个数字");
        return;
    }
    if (num > 100 || num < 1) {
        setMsg("数字必须在1到100之间");
        return;
    }
    if (num === randomNumber) {
        setMsg("");
        ewConfirm({
            title: "温馨提示",
            content: "恭喜您，猜对了!",
            sureText: "再玩一次",
            footerAlign: "center",
            sure: () => {
                window.location.reload();
            },
            showCancel: false,
            isClickModal:false
        })
    } else if (num > randomNumber) {
        return setMsg("数字大了");
    } else {
        return setMsg("数字小了");
    }
}
function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function setMsg(msg){
    $(".say").innerHTML = "您说的是:";
    return $("#msg .text").innerHTML = msg;
}
recognition.addEventListener('result', onSpeak);
recognition.addEventListener("end", () => recognition.start());