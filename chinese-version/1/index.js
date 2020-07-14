/**
 *  表单验证功能
 */
function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}
const form = $('.form');
const input = $$('.form input');
const submitBtn = $('.submit-btn');
HTMLElement.prototype.hasClass = function (className) {
    return new RegExp(" " + className + " ").test(' ' + this.className + ' ');
}
/**
 * 显示成功
 * @param {*} el 
 */
function showSuccess(el) {
    let parentElement = el.parentElement;
    if (parentElement.hasClass('error')) {
        parentElement.classList.replace('error', 'success');
    } else {
        parentElement.classList.add('success');
    }
    el.nextElementSibling.style.visibility = 'hidden';
}
/**
 * 显示错误
 *
 * @param {*} el
 * @param {*} msg
 */
function showError(el, msg) {
    let parentElement = el.parentElement;
    if (parentElement.hasClass('success')) {
        parentElement.classList.replace('success', 'error');
    } else {
        parentElement.classList.add('error');
    }
    el.nextElementSibling.style.visibility = 'visible';
    el.nextElementSibling.innerHTML = msg;
}
/**
 * 获取字段名
 * @param {*} el
 * @returns
 */
function getFieldName(el) {
    let text = el.previousElementSibling.innerHTML;
    return text.slice(0, text.indexOf(':'));
}
/**
 * 检查不能输入为空
 * @param {*} el 
 */
function allCheck(el) {
    [].slice.call(el).forEach((item, index) => {
        if (!item.value.trim()) {
            showError(item, getFieldName(item) + '不能为空!');
        } else {
            showSuccess(item);
            switch (index) {
                case 0:
                    checkLength(item, 3, 20);
                    break;
                case 1:
                    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (regEmail.test(item.value)) {
                        showSuccess(item);
                    } else {
                        showError(item, '输入的' + getFieldName(item) + '格式有误!');
                    }
                    break
                case 2:
                    checkLength(item, 6, 20);
                    break;
                case 3:
                    checkLength(item, 6, 20);
                    break;
            }
        }
    });
}
/**
 * 检查输入的字符数
 * @param {*} el 
 * @param {*} min 
 * @param {*} max 
 */
function checkLength(el, min, max) {
    if (el.value.length < min) {
        showError(el, '输入的' + getFieldName(el) + '字符长度不能低于' + min + '个');
    } else if (el.value.length > max) {
        showError(el, '输入的' + getFieldName(el) + '字符长度不能高于' + max + '个');
    } else {
        showSuccess(el);
    }
}

submitBtn.addEventListener('click', function () {
    allCheck(input);
}, false);