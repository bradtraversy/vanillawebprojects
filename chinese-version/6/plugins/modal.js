/**
 * 创建弹出框
 * @param {*} option 
 */
function createPopBox(option) {
    let defaultConfig = {
        title: "提示",
        content: option || "默认内容",
        sure: () => {
            this.close(600);
        },
        cancel: () => {
            this.close(600);
        },
        showCancel: false,
        closeTime: 0,
        footerAlign: "right",
        isClickModal: true
    };
    let config = null;
    if (typeof option === 'object' && !!option) {
        config = Object.assign(defaultConfig, option);
    }
    this.config = config ? config : defaultConfig;
    this.renderStyle(this.config);
    this._renderPopBox(this.config);
}
/**,
 * 获取DOM元素
 */
createPopBox.prototype.$ = function (selector, isSingle) {
    // 如果传入的包含#，则是唯一的元素执行querySelector方法，否则根据传入的布尔值来判断执行哪个方法查询DOM
    isSingle = selector.indexOf('#') > -1 ? true : typeof isSingle === 'boolean' ? isSingle : true;
    return isSingle ? document.querySelector(selector) : document.querySelectorAll(selector);
}
createPopBox.prototype.create = function (tagName) {
    return document.createElement(tagName);
}
/**
* 关闭弹出框
* @param {*} time 
*/
createPopBox.prototype.close = function (time) {
    setTimeout(() => {
        this.$('.ew-popBox-mask').style.display = "none";
    }, time)
}
createPopBox.prototype.renderStyle = function (option) {
    option.footerAlign = ['left', 'center', 'right'].indexOf(option.footerAlign) > -1 ? option.footerAlign : 'right';
    const style = this.create('style');
    style.id = "ew-alert-style";
    style.textContent = ".ew-popBox-mask {position: fixed;left: 0;right: 0;top: 0;bottom: 0;background-color: rgba(0, 0, 0, 0.6);z-index: 10000;}" +
        ".ew-popBox{min-width: 300px;min-height: 80px;background-color: #ffffff;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);border-radius: 5px;}" + ".ew-popBox-title{padding: 8px 9px;font-weight: 500;font-size: 18px;}" + ".ew-popBox-content{padding: 20px;font-size:15px;line-height:25px;}.ew-popBox-content a{color:#665678;font-size:16px;text-decoration:none;cursor:pointer;border-bottom:1px solid #665678;}.ew-popBox-content a:hover{ color:#2396ef;}.ew-popBox-content img{ border-radius:5px;width:auto;height:auto;max-width:1000px;max-height:600px;display:block;margin:1em auto;}" + ".ew-popBox-btnGroup{padding: 8px 10px;text-align:" + option.footerAlign + ";}" + ".ew-popBox-btnGroup button{outline:none;letter-spacing:2px;display:inline-block;}" + ".ew-btn {line-height: 1;white-space: nowrap;background: #fff;border: 1px solid #dcdfe6;color: #606266;-webkit-appearance: none;transition: 0.1s;font-weight: 500;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;padding: 12px 20px;font-size: 14px;border-radius: 4px;cursor: pointer;}" + ".ew-btn-mini {padding: 7px 15px;font-size: 12px;border-radius: 3px;}" + ".ew-btn:hover,.ew-btn:active{color: #57a3f3;background-color: #fff;border-color: #57a3f3;}" + ".ew-btn-primary{color: #fff;background-color: #409eff;border-color: #409eff;}" + ".ew-btn-primary:hover,.ew-btn-primary:active {background: #66b1ff;border-color: #66b1ff;color: #fff;}";
    if (!this.$('#ew-alert-style')) {
        this.$('head').appendChild(style);
    } else {
        this.$('head').replaceChild(style, this.$('#ew-alert-style'));
    }
}
/**
 * 功能:渲染弹出框
 * 参数:配置对象
 */
createPopBox.prototype._renderPopBox = function (option) {
    let cancelDisplay = option.showCancel ? 'inline-block' : 'none';
    let cancelText = option.cancelText ? option.cancelText : '取消';
    let sureText = option.sureText ? option.sureText : '确认';
    let popBoxHTML = '<div class="ew-popBox-mask">' +
        '<div class="ew-popBox">' +
        '<div class="ew-popBox-title">' +
        option.title +
        '</div>' +
        '<div class="ew-popBox-content">' +
        option.content +
        '</div>' +
        '<div class="ew-popBox-btnGroup">' +
        '<button type="button" class="ew-btn ew-btn-primary" id="popBoxSure">' + sureText + '</button>' +
        '<button type="button" class="ew-btn" style="display:' + cancelDisplay + ';margin-left:25px;" id="popBoxCancel">' + cancelText + '</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    const maskLayer = this.$('.ew-popBox-mask');
    const div = this.create('div');
    div.id = "container";
    if (!maskLayer) {
        div.innerHTML += popBoxHTML;
    } else {
        maskLayer.parentElement.removeChild(maskLayer);
        div.innerHTML += popBoxHTML;
    }
    document.body.appendChild(div.querySelector('.ew-popBox-mask').cloneNode(true));
    //点击确定按钮
    this.$('#popBoxSure').onclick = (e) => {
        option.sure(this, e);
    }
    // 点击取消按钮
    this.$('#popBoxCancel').onclick = (e) => {
        option.cancel(this, e);
    }
    if (option.isClickModal) {
        // 点击遮罩层
        this.$('.ew-popBox-mask').onclick = (e) => {
            if (e.target.className.indexOf('ew-popBox-mask') > -1) {
                this.close(600);
            }
        }
    }
    // 如果传入关闭时间。
    if (option.closeTime > 0) {
        this.close(option.closeTime);
    }
}
window.ewConfirm = function (option) {
    return new createPopBox(option);
}