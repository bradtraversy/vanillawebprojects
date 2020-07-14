
/**
 *  页面功能
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
// 变量定义部分
const difficultyArr = [
    {
        label:"容易",
        value:"easy"
    },
    {
        label:"一般",
        value:"medium"
    },
    {
        label:"困难",
        value:"hard"
    }
];
const words = [
    'sigh',
    'tense',
    'airplane',
    'ball',
    'pies',
    'juice',
    'warlike',
    'bad',
    'north',
    'dependent',
    'steer',
    'silver',
    'highfalutin',
    'superficial',
    'quince',
    'eight',
    'feeble',
    'admit',
    'drag',
    'loving'
  ];
// 默认的难易程度
let difficulty = localStorage.getItem('difficulty') ? localStorage.getItem('difficulty') : 'medium';
const text= $("#text");
const timeEl = $("#time");
const scoreEl = $("#score");
const wordEl = $("#word");

let score = 0;
let time = 10;
let timer = null;

let randomWord;
text.focus();
updateTime();
/**
 * 随机一个单词
 */
function getRandomWord(){
    return words[Math.floor(Math.random() * words.length)];
}
/**
 * 更新单词DOM
 */
function updateWordDom(){
    randomWord = getRandomWord();
    wordEl.innerHTML = randomWord;
}
/**
 * 更新得分
 */
function updateScore(){
    score++;
    scoreEl.innerHTML = score;
}
/**
 * 更新时间
 */
function updateTime(){
    time--;
    timeEl.innerHTML = time + 's';
    if(time <= 0){
        if(timer)clearTimeout(timer);
        gameOver();
    }else{
        timer = setTimeout(updateTime, 1000);
    }
}
/**
 * 游戏结束
 */
function gameOver(){
    return ewConfirm({
        title:"时间已经用完",
        content:`你最后的得分是${score}`,
        isClickModal:false,
        sureText:"再玩一次",
        sure:(context) => {
            context.close(1);
            time = 10;
            updateWordDom();
            updateTime();
            score = 0;
            scoreEl.innerHTML = 0;
        },
        footerAlign:"center",
        showCancel:false
    })
}
updateWordDom();
text.addEventListener('input',(e) => {
    const value = e.target.value;
    if(value === randomWord){
        e.target.value = '';
        updateWordDom();
        updateScore();
        if(difficulty === 'easy'){
            time += 5;
        }else if(difficulty === 'medium'){
            time += 3;
        }else{
            time += 2;
        }
    }
})
/**
 * 加载选择项
 * @param {*} selectContainer 
 */
function loadSelect(selectContainer){
    const selectListItem = selectContainer.querySelector('.select-items');
    selectListItem.innerHTML = "";
    difficultyArr.forEach(diff => {
        const  diffItem = document.createElement('div');
        diffItem.classList.add('select-option');
        diffItem.setAttribute('data-value',diff.value);
        diffItem.innerHTML = diff.label;
        selectListItem.appendChild(diffItem);
    });
    const label = difficultyArr.find(_ => difficulty === _.value).label;
    setDefaultSelectValue(selectContainer.querySelector('.select-content'),label);
}
/**
 * 设置选择下拉选项值
 * @param {*} el 
 * @param {*} label 
 */
function setDefaultSelectValue(el,label){
    return el.innerHTML = label;
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
    selectOptionArr.forEach((item) => {
        item.onclick = function () {
            selectFlag = false;
            isBlur = true;
            let select_content = this.innerHTML;
            this.parentElement.previousElementSibling.firstElementChild.innerHTML = select_content;
            selectOptionArr.map((opt) => {
                opt.classList.remove('select-this');
            });
            difficulty = this.getAttribute('data-value');
            localStorage.setItem('difficulty',difficulty);
            this.classList.add('select-this');
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
loadSelect($('.select-hard'));
selectHandle($('.select-hard'));
// 点击设置按钮
$("#setting-btn").addEventListener('click',() => {
    $("#setting").classList.toggle('hide');
});
document.addEventListener('keydown',(e) => {
    if(e.ctrlKey && e.keyCode === 67){
        return $message.error("请不要复制单词,这是违规操作!");
    }
});