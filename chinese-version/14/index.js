function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}
HTMLElement.prototype.hasClass = function (className) {
    return new RegExp(" " + className + " ").test(' ' + this.className + ' ');
}
// 变量获取部分
const clearBtn = $("#clear-cards");
const showAddCardsBtn = $("#add-cards-btn");
const hideAddCardsBtn = $("#close-addCards-btn");
const addNewCardContainer = $("#add-card-container");
const cardsContainer = $("#cards-container");
const cardTitle = $("#card-title");
const cardContent = $("#card-content");
const addNewCardBtn = $("#add-new-card-btn");
const currentPageEl = $("#current");
const prevBtn = $("#prev");
const nextBtn = $("#next");
const checkedBtn = $("#check-card-btn");
const deleteBtn = $("#delete-select-card");
// 定义数据
let cardsData = localStorage.getItem('cards') ? JSON.parse(localStorage.getItem('cards')) : [];
let currentPage = 1;
let currentSelectCardID = null;
// 点击显示添加新卡片容器
showAddCardsBtn.addEventListener('click',() => {
    addNewCardContainer.classList.add('show');
});
// 点击隐藏添加新卡片容器
hideAddCardsBtn.addEventListener('click',closeAddNewCardContainer);
/**
 * 隐藏添加新卡片容器
 */
function closeAddNewCardContainer(){
    return addNewCardContainer.classList.remove('show');
}
/**
 * 创建uuid
 */
function createRandomId() {
    // function uuid(a) {
    //     return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, uuid);
    // }   
    return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
}
/**
 * 加载卡片
 */
function loadAllCards(){
    updatePage();
    cardsContainer.innerHTML = "";
    cardsData.forEach((card,index) => createCard(card,index));
    const children = cardsContainer.querySelectorAll('.card');
    children.forEach(card => {
        card.addEventListener('click',(e) => {
            if(!e.target.hasClass("checked-icon")){
                card.classList.toggle("show-card-content");
            }else{
                e.target.classList.toggle('checked');
                if(e.target.hasClass('checked')){
                    deleteBtn.style.display = 'inline-block';
                    currentSelectCardID = e.target.parentElement.getAttribute('data-id');
                }else{
                    currentSelectCardID = null;
                    deleteBtn.style.display = "none";
                }
            }
        });
    })
}
/**
 * 更新分页
 */
function updatePage(){
    currentPageEl.innerHTML = cardsData.length <= 0 ? `` : `${currentPage}/${cardsData.length}`;
}
/**
 * 创建卡片
 * @param {*} card 
 * @param {*} index 
 */
function createCard(card,index){
    const cardItem = document.createElement('div');
    cardItem.className = "card";
    if(index === currentPage - 1){
        cardItem.classList.add("active");
    }
    cardItem.innerHTML = `
    <span class="number">${ index + 1}</span>
    <button class="btn-none check-card-btn" id="check-card-btn" type="button" data-id = ${ card.id }>
        <i class="checked-icon"></i>
    </button>
    <div class="inner-card" >
        <div class="inner-card-front">
            <p>${ card.title }</p>
        </div>
        <div class="inner-card-back">
            <p>${ card.content }</p>
        </div>
    </div>`;
    cardsContainer.appendChild(cardItem);
}
/**
 * 存储卡片数据
 */
function storeCardsData(){
    return localStorage.setItem('cards',JSON.stringify(cardsData));
}
/**
 * 显示当前卡片
 */
function showCurrentCard(){
    cardsContainer.querySelectorAll('.card').forEach((card,index) => {
        card.classList.remove('active');
        if(currentPage - 1 === index){
            card.classList.add('active');
        }
    });
}
// 点击添加新卡片内容
addNewCardBtn.addEventListener('click',() => {
    if(!cardTitle.value.trim())return $message.warning("请填写卡片标题!");
    if(!cardContent.value.trim())return $message.warning("请填写卡片内容!");
    const card = {
        title:cardTitle.value,
        content:cardContent.value,
        id:createRandomId()
    };
    cardsData.push(card);
    storeCardsData();
    closeAddNewCardContainer();
    loadAllCards();
    cardTitle.value = cardContent.value = "";
});
// 点击上一页
prevBtn.addEventListener('click',() => {
    currentPage--;
    if(currentPage < 1)currentPage = cardsData.length;
    showCurrentCard();
    updatePage();
});
// 点击下一页
nextBtn.addEventListener('click', () => {
    currentPage++;
    if(currentPage > cardsData.length)currentPage = 1;
    showCurrentCard();
    updatePage();
});
// 点击清除所有卡片
clearBtn.addEventListener('click',() => {
    currentPage = 1;
    localStorage.removeItem('cards');
    cardsData = [];
    updatePage();
    loadAllCards();
});
// 点击选中删除卡片
deleteBtn.addEventListener('click',() => {
    if(!currentSelectCardID)return $message.error("请选择需要删除的卡片!");
    cardsData = cardsData.filter(card => card.id !== currentSelectCardID);
    storeCardsData();
    loadAllCards();
    updatePage();
    deleteBtn.style.display = 'none';
})
loadAllCards();