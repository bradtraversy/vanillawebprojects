/**
 * 页面功能
 */
function $(selector) {
    return document.querySelector(selector);
}
const content = $("#content");
const text = $("#text");

const totalTime = 7500;
const breathTime = (totalTime / 5) * 2;
const holdTime = totalTime / 5;

function breathAnimation(){
    text.innerHTML = "吸气";
    content.className = "content grow";
    setTimeout(() => {
        text.innerHTML = "屏息";
        setTimeout(() => {
            text.innerHTML = "吐气";
            content.className = "content shrink";
        },holdTime);
    },breathTime)
}

breathAnimation();
setInterval(breathAnimation, totalTime);