
/**
 *  页面功能
 */
function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}
/**
 * 页面数据
 */
var pageData = getData() || {
    movieIndex: 0,
    moviePrice: 10,
    seatsIndexArr: []
};
HTMLElement.prototype.hasClass = function (className) {
    return new RegExp(" " + className + " ").test(' ' + this.className + ' ');
}
/**
 * 存储数据
 * @param {*} data 
 */
function setData(data) {
    return localStorage.setItem('pageData', JSON.stringify(data));
}
/**
 * 获取数据
 */
function getData() {
    let data = localStorage.getItem('pageData');
    if (!data) return;
    return JSON.parse(data);
}
/**
 * 下拉逻辑
 */
function selectHandle(selectContainer) {
    let selectFlag = false;
    let showSelect = function (el, bool) {
        if (bool) {
            if (el.lastElementChild.hasClass('select-down')) {
                el.lastElementChild.classList.replace('select-down', 'select-up');
            } else {
                el.lastElementChild.classList.add('select-up');
            }
            el.nextElementSibling.style.display = "block";
        } else {
            if (el.lastElementChild.hasClass('select-up')) {
                el.lastElementChild.classList.replace('select-up', 'select-down');
            } else {
                el.lastElementChild.classList.add('select-down');
            }
            el.nextElementSibling.style.display = "none";
        }
    }
    selectContainer.firstElementChild.onclick = function () {
        selectFlag = !selectFlag;
        showSelect(this, selectFlag);
    };
    let isBlur = false;
    let selectOptionArr = [].slice.call(selectContainer.lastElementChild.children);
    selectOptionArr.forEach((item, index) => {
        item.onclick = function () {
            selectFlag = false;
            isBlur = true;
            let select_content = this.innerHTML;
            this.parentElement.previousElementSibling.firstElementChild.innerHTML = select_content;
            selectOptionArr.map((opt) => {
                opt.classList.remove('select-this');
            });
            this.classList.add('select-this');
            pageData.movieIndex = index;
            pageData.moviePrice = Number(this.dataset.value);
            setValue($('.select-container'), $$('.container .seat'));
            showSelect(this.parentElement.previousElementSibling, false);
        }
    });
    selectContainer.firstElementChild.firstElementChild.onblur = function () {
        setTimeout(() => {
            if (!isBlur) {
                selectFlag = false;
                showSelect(this.parentElement, false);
            } else {
                isBlur = false;
            }
        }, 200)
    };
}
/**
 * 设置默认值
 * @param {*} selectContainer 
 * @param {*} seats 
 */
function setValue(selectContainer, seats) {
    setData(pageData);
    selectContainer.firstElementChild.firstElementChild.innerHTML = selectContainer.lastElementChild.children[pageData.movieIndex].innerHTML;
    computedSeat(pageData.seatsIndexArr, pageData.moviePrice);
    for (let i = 0; i < pageData.seatsIndexArr.length; i++) {
        seats[pageData.seatsIndexArr[i]].classList.add('selected');
    }
}
/**
 * 座位逻辑
 */
function seatHandle(seats) {
    for (let i = 0; i < seats.length; i++) {
        if (!seats[i].hasClass('occupied')) {
            seats[i].onclick = function () {
                this.classList.toggle('selected');
                let idx = pageData.seatsIndexArr.indexOf(i);
                if (!this.hasClass('selected') && idx > -1) {
                    pageData.seatsIndexArr.splice(idx, 1);
                } else if (this.hasClass('selected')) {
                    pageData.seatsIndexArr.push(i);
                }
                setValue($('.select-container'), seats);
            }
        }
    }
}
/**
 * 计算座位逻辑
 * @param {*} totalSeats 
 */
function computedSeat(totalSeats, curPrice) {
    $('#seat-total-count').innerHTML = totalSeats.length;
    $('#seat-total-price').innerHTML = totalSeats.length * curPrice;
}
window.onload = function () {
    setValue($('.select-container'), $$('.container .seat'));
    selectHandle($('.select-container'));
    seatHandle($$('.container .seat'));
}