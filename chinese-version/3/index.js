/**
 * 页面逻辑
 */
function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}
HTMLElement.prototype.hasClass = function (className) {
    return new RegExp(" " + className + " ").test(' ' + this.className + ' ');
}
var video = $('video.screen');
let progressThumb = $('.progress .progress-thumb');
let totalWidth = $('.progress').offsetWidth - 5;
let leftSecond = totalWidth;
video.oncanplay  = function(){
    leftSecond = totalWidth / Math.floor(video.duration);
}

function progressHandle() {
    let isMove = false;
    // 拖动进度条
    let mouseFunction = function (e) {
        let mouseX = e.clientX;
        isMove = true;
        let defaultLeft = progressThumb.style.left;
        defaultLeft = defaultLeft ? parseInt(defaultLeft) : 0;
        document.onmousemove = function (eve) {
            let left = 0;
            // 判断拖动方向
            if (eve.clientX > mouseX && isMove) {
                left = defaultLeft + eve.clientX - mouseX;
                if (left > totalWidth) left = totalWidth;
            } else if (eve.clientX < mouseX && isMove) {
                left = defaultLeft - (mouseX - eve.clientX);
                if (left < 0) left = 0;
            }
            setLeft(left);
            setVideoCurrentTime(Math.floor(left / leftSecond));
            cancelHandle(isMove, progressThumb, mouseFunction);
        }
    }
    progressThumb.onmousedown = mouseFunction;
    // 点击进度条
    $('.progress .progress-item').onclick = function (e) {
        let boundObj = this.getBoundingClientRect();
        let left = e.clientX - boundObj.x;
        setLeft(left);
        setVideoCurrentTime(Math.floor(left / leftSecond));
        setTimeout(() => {
            video.play();
        },0)
    }
}
/**
 * 注销事件
 * @param {*} isMove 
 * @param {*} el 
 * @param {*} eventHandler 
 */
function cancelHandle(isMove, el, eventHandler) {
    document.onmouseup = function () {
        el.removeEventListener('mousedown', eventHandler, false);
        document.onmousemove = null;
        isMove = false;
    }
}
/**
 * 播放视频
 */
function playVideo() {
    if (video.paused && video.readyState) {
        video.play();
    } else {
        video.pause();
    }
}
/**
 * 更新图标
 */
function updatePlayIcon() {
    if (!video.paused) {
        $('#play').firstElementChild.classList.replace('fa-play', 'fa-pause');
    } else {
        $('#play').firstElementChild.classList.replace('fa-pause', 'fa-play');
    }
}
/**
 * 更新进度条
 */
function updateProgress() {
    setVideoTime(video.currentTime);
    let curLeft = leftSecond * video.currentTime;
    let left = curLeft > totalWidth ? totalWidth : curLeft;
    setLeft(left);
}
/**
 * 设置偏移
 * @param {*} left 
 */
function setLeft(left) {
    return progressThumb.style.left = left + 'px';
}
/**
 * 设置视频播放时间
 * @param {*} time 
 */
function setVideoCurrentTime(time){
    if(isNaN(time))return false;
    time = parseInt(time);
    return video.currentTime = String(+time);
}
/**
 * 设置时间
 * @param {*} time 
 */
function setVideoTime(time) {
    let minutes = Math.floor(time / 60), seconds = Math.floor(time % 60);
    if (minutes < 10) minutes = '0' + minutes.toString();
    if (seconds < 10) seconds = '0' + seconds.toString();
    $('#time').innerHTML = `${minutes}:${seconds}`;
}
window.onload = function () {
    progressHandle();
    $('#play').onclick = function () {
        playVideo(video);
    }
    $('#stop').onclick = function () {
        setVideoCurrentTime(0);
        video.pause();
    }
    video.addEventListener('click', playVideo);
    video.addEventListener('play', updatePlayIcon);
    video.addEventListener('pause', updatePlayIcon);
    video.addEventListener('timeupdate', updateProgress);
}