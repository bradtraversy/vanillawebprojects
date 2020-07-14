// 消息框类型
const typeMap = {
    success:"success",
    info:"info",
    warning:"warning",
    error:"error"
};
function isFunction(value){
    return typeof value === 'function';
}
function isDom(el) {
    return typeof HTMLElement === 'object' ? el instanceof HTMLElement : el && typeof el === 'object' && el.nodeType === 1 && typeof el.nodeName === 'string' || el instanceof HTMLCollection || el instanceof NodeList;
}
function addMessageStyle() {
    var cssText = `
    .ew-message {
        min-width: 300px;
        border: 1px solid #ebeef5;
        position: fixed;
        left: 50%;
        background-color: #edf2fc;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        padding: 10px 15px;
        overflow: hidden;
        transition: transform .4s;
        border-radius: 4px;
        top: 25px;
        z-index: 10001;
    }
    
    .ew-message .ew-message-close {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        cursor: pointer;
        color: #C0C4CC;
        font-size: 16px;
    }
    .ew-message>.ew-message-close:hover,
    .ew-message>.ew-message-close:active {
        color: #909399;
    }
    .ew-message-info p {
        color: #909399;
        line-height: 1;
        font-size: 14px;
    }
    .ew-message-center {
        justify-content: center;
    }
    .ew-message-success {
        background-color: #e1f3d8;
        border-color: #e1f3d8;
    }
    .ew-message-success p {
        color: #67c23a;
    }
    .ew-message-warning {
        background-color: #fdfce6;
        border-color: #faecd8;
    }
    .ew-message-warning p {
        color: #e6a23c;
    }
    .ew-message-error {
        background-color: #fef0f0;
        border-color: #fde2e2;
    }
    .ew-message-error p {
        color: #f56c6c;
    }`;

    function styleInject(css, ref) {
        if (ref === void 0) ref = {};
        var insertAt = ref.insertAt;
        if (!css || typeof document === 'undefined') return;
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = "text/css";
        if (insertAt === 'top') {
            if (head.firstChild) {
                head.insertBefore(style, head.firstChild)
            } else {
                head.appendChild(style);
            }
        } else {
            head.appendChild(style);
        }
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }
    styleInject(cssText);
}
addMessageStyle();
let $message = {};
window['$message'] = $message= function(option){
    return new Message(option);
}
for(let key in typeMap){
    window.$message[key] =$message[key] = function(option){
        let messageOption = {
            content:"内容",
            center:false,
            type:key,
            closeTime:600,
            showClose:true
        }
        if(typeof option === 'string'){
            messageOption.content = option;
        }else if(typeof option === 'object' && !!option){
            messageOption = Object.assign(messageOption,option);
        }
       return new Message(messageOption);
    }
}

function Message(option){
    let messageOption = {
        content:"内容",
        center:false,
        type:"info",
        closeTime:600,
        showClose:true
    }
    if(typeof option === 'string'){
        messageOption.content = option;
    }else if(typeof option === 'object' && !!option){
        messageOption = Object.assign(messageOption,option);
    }
    this.render(messageOption);
    
}
Message.prototype.render = function(messageOption){
    if (messageOption.closeTime <= 0 && !messageOption.showClose) messageOption.showClose = true;
    let closeBtn = null;
    //设置关闭按钮相关
    if (messageOption.showClose) {
        closeBtn = document.createElement('i');
        closeBtn.classList.add('ew-message-close');
        closeBtn.innerHTML = '&times;';
    }
    document.body.appendChild(this.create(messageOption, closeBtn));
    let messageElement = document.querySelectorAll('.ew-message');
    this.setTop(messageElement);
    // 关闭时间大于0时关闭提示框
    if (messageOption.closeTime > 0) {
        this.close(messageOption.el, messageOption.closeTime);
    }
    // 点击关闭消息提示框
    if (messageOption.closeBtnEl) {
        messageOption.closeBtnEl.onclick = (e) => {
            this.close(e.currentTarget.parentElement, 0);
        }
    }
}
Message.prototype.setTop = function (messageElement) {
    if(!messageElement || !messageElement.length)return;
    // 每个高度是一样的，所以随便获取一个即可
    const height = messageElement.length ? messageElement[0].offsetHeight : messageElement.offsetHeight;
    for (let i = 0, len = messageElement.length; i < len; i++) {
        messageElement[i].setAttribute('style', 'top:' + (25 * (i + 1) + height * i) + 'px;');
    }
}
Message.prototype.create = function(messageOption,closeBtn){
    let element = document.createElement('div');
    element.className = `ew-message ew-message-${messageOption.type}`;
    if (messageOption.center) element.classList.add('ew-message-center');
    const p = document.createElement('p');
    p.innerHTML = messageOption.content;
    element.appendChild(p);
    if (closeBtn) element.appendChild(closeBtn);
    messageOption.el = element;
    messageOption.closeBtnEl = closeBtn;
    return element;
}
Message.prototype.close = function(messageElement, time){
    setTimeout(() => {
        if (messageElement && messageElement.length) {
            [].slice.call(messageElement).forEach((item) => {
                if (isDom(item) && isDom(item.parentElement) && isFunction(item.parentElement.removeChild)) {
                    item.parentElement.removeChild(item);
                }
            })
        } else {
            if (isDom(messageElement) && isDom(messageElement.parentElement) && isFunction(messageElement.parentElement.removeChild)) {
                messageElement.parentElement.removeChild(messageElement);
            }
        }
        this.setTop(document.querySelectorAll('.ew-message'));
    }, time * 10);
}