function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}
const vegetables = [
    "川味火锅", "水煮鱼","回锅肉","麻婆豆腐", "鱼香肉丝","水煮肉片","辣子鸡", "酸菜鱼","宫保鸡丁","甜皮鸭"
];
const draggleList = $("#draggle-list");
const checkBtn = $("#check-btn");
// 存储数据
let listItems = [];

// 定义拖动开始索引
let dragStartIndex;

createList();
function createList(){
    [...vegetables].map(a => ({ value:a,sort:Math.random() })).sort((a,b) => a.sort - b.sort).map(a => a.value).forEach((vegetable,index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-index',index);
        listItem.innerHTML = `
            <span class="number">${ index + 1}</span>
            <div class="draggable" draggable="true">
                <p class="vegetable-name">${ vegetable }</p>
                <i class="fas fa-grip-lines"></i>
            </div>
        `;
        listItems.push(listItem);
        draggleList.appendChild(listItem);
    });
    addEventListeners();
}
function onDragStart(){
    dragStartIndex = +this.closest('li').getAttribute('data-index');
}
function onDragOver(e){
    e.preventDefault();
}
function onDrop(){
    const dragEndIndex = +this.getAttribute('data-index');
    console.log(dragEndIndex);
    swapItems(dragStartIndex,dragEndIndex);
    this.classList.remove('over');
}
function onDragEnter(){
    this.classList.add('over');
}
function onDragLeave(){
    this.classList.remove('over');
}
function swapItems(startIndex,endIndex){
    if(typeof startIndex !== 'number' || typeof endIndex !== 'number')return false;
    const fromItem = listItems[startIndex].querySelector('.draggable');
    const toItem = listItems[endIndex].querySelector('.draggable');

    listItems[startIndex].appendChild(toItem);
    listItems[endIndex].appendChild(fromItem);
}
function addEventListeners(){
    const dragItems = $$('.draggable');
    const dragListItems = $$('#draggle-list li');

    dragItems.forEach((item) => {
        item.addEventListener('dragstart',onDragStart);
    });
    dragListItems.forEach((item) => {
        item.addEventListener('dragover',onDragOver)
        item.addEventListener('drop',onDrop)
        item.addEventListener('dragenter',onDragEnter);
        item.addEventListener('dragleave',onDragLeave);
    })
}
function checkOrder(){
    listItems.forEach((listItem,index) => {
        const vegetableName = listItem.querySelector('.draggable').innerText.trim();
        if(vegetableName !== vegetables[index]){
            listItem.classList.add('wrong');
        }else{
            listItem.classList.remove('wrong');
            listItem.classList.add('right');
        }
    })
}
checkBtn.addEventListener('click',checkOrder);