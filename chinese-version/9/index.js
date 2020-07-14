
function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}
/**
 * 设置ID
 */
function getRandomId(){
    return Math.floor(Math.random() * 100000000);
}

let list = $('#list');
let moneyPlus = $("#money-plus");
let moneyMinus = $("#money-minus");
let text = $("#text");
let amount = $("#amount");
let sureBtn = $("#sureBtn");
let balanceEl = $("#balance");
/**
 * 获取存储的数据
 */
let transactions = (() => {
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
})();
/**
 * 存储数据
 */
function setTransactions(){
    return localStorage.setItem('transactions',JSON.stringify(transactions));
}
/**
 * 添加收入或者消费
 */
function addTransaction(){
    if(!text.value.trim() || !amount.value.trim()){
        return $message.error("请填写交易内容(收入来源)与交易金额(收入金额)");
    }else{
        let transaction = {
            id:getRandomId(),
            text:text.value,
            amount:+amount.value
        }
        transactions.push(transaction);
        addTransactionDOM(transaction);
        setTransactions();
        text.value = "";
        amount.value = "";
        updateValues();
    }
}
function addTransactionDOM(transaction){
    const item = document.createElement('li');

    //添加类名
    item.classList.add(transaction.amount > 0 ? 'plus' : 'minus');

    // 设置内容
    item.innerHTML = `
        您通过${ transaction.text }${ transaction.amount > 0 ? "赚到了" : "消费了"}
        <span>$${ Math.abs(transaction.amount) }</span>
        <button type="button" class="delete-btn" onclick="removeTransaction(${ transaction.id })">&times;</button>
    `;
    list.appendChild(item);
}
/**
 * 更新余额，收入，消费
 */
function updateValues(){
    // 金额数据
    const amounts = transactions.map(tran => tran.amount);
    // 余额
    const balance = amounts.reduce((c,v) => (c += v),0).toFixed(2);
    // 收入
    const income = amounts.filter(amount => amount > 0).reduce((c,v) => (c += v),0).toFixed(2);
    // 消费
    const cost = (amounts.filter(amount =>  amount < 0).reduce((c,v) => (c += v),0) * -1).toFixed(2);

    balanceEl.innerHTML = `$${balance}`;
    moneyPlus.innerHTML = `$${income}`;
    moneyMinus.innerHTML = `$${cost}`;
}
function removeTransaction(id){
    transactions = transactions.filter(_ => _.id !== id);
    setTransactions();
    init();
}
function init(){
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
}
init();
sureBtn.addEventListener('click',addTransaction);