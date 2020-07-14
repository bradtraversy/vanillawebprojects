function $(selector) {
    return document.querySelector(selector);
}

let countDown = $('#count-down');
let loading = $("#loading");
let day = $("#day");
let hour = $("#hour");
let minute = $("#minute");
let year = $("#year");
let second = $("#second");

const getDate = function (time) {
    return time ? new Date(time) : new Date();
};

const currentYear = getDate().getFullYear();
const newYearTime = getDate(`January 01 ${currentYear + 1} 00:00:00`);

function updateCountDown() {
    const currentTime = getDate();
    const diff = newYearTime - currentTime;

    day.innerHTML =  Math.floor(diff / 1000 / 60 / 60 / 24);
    hour.innerHTML = formatTime(Math.floor(diff / 1000 / 60 / 60) % 24);
    minute.innerHTML = formatTime(Math.floor(diff / 1000 / 60) % 60);
    second.innerHTML = formatTime(Math.floor(diff / 1000) % 60);

    setTimeout(updateCountDown,1000);
}

function formatTime(time) {
    return time < 10 ? '0' + time : time;
}
year.innerHTML = currentYear + 1;
setTimeout(() => {
    loading.remove();
    countDown.style.display = "flex";
}, 100);
updateCountDown();