/**
 * 页面功能
 */
function $(selector) {
    return document.querySelector(selector);
}
let allUserData = [];
let main = $('#main');
let addUserBtn = $('#addUser');
let doubleWealthBtn = $('#doubleWealth');
let showMillionairesBtn = $('#showMillionaires');
let sortBtn = $('#sort');
let calculateWealthBtn = $("#calculateWealth");
/**
 * 接口请求数据
 */
async function getRandomUser() {
    const res = await fetch("https://randomuser.me/api");
    const data = await res.json();

    const user = data.results[0];

    const userData = {
        name: `${user.name.first}${user.name.last}`,
        money: Math.floor(Math.random() * 1000000)
    }
    addUser(userData);
}

/**
 * 添加富翁
 * @param {*} user 
 */
function addUser(user) {
    allUserData.push(user);
    updateDom();
}

/**
 * 财富双倍
 */
function doubleWealth() {
    allUserData = allUserData.map((item) => { return { ...item, money: item.money * 2 } });
    // console.log(allUserData);
    updateDom();
}

/**
 * 仅显示百万富翁
 */
function showMillionaires() {
    allUserData = allUserData.filter(item => item.money > 1000000);
    updateDom();
}

/**
 * 排序
 */
function sortData() {
    allUserData = allUserData.sort((a, b) => b.money - a.money);
    updateDom();
}
/**
 * 计算总财富
 */
function calculateWealth() {
    let totalWealth = allUserData.reduce((c, v) => {
        return c += v.money;
    }, 0);

    const totalWealthElement = document.createElement('div');
    totalWealthElement.innerHTML = `总财富为:<span class="total-wealth">${formatMoney(totalWealth)}</span>`;
    main.appendChild(totalWealthElement);

}
// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
/**
 * 处理钱格式
 * @param {*} number 
 */
function formatMoney(number) {
    return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
/**
 * 更新DOM
 * @param {*} data 
 */
function updateDom(data = allUserData) {
    main.innerHTML = "";
    data.forEach((user) => {
        const person = document.createElement('div');
        person.className = 'person';
        person.innerHTML = `<strong>${user.name}</strong>${formatMoney(user.money)}`;
        main.appendChild(person);
    })
}
window.onload = function () {
    for (let i = 0; i < 5; i++) {
        getRandomUser();
    }
    addUserBtn.addEventListener('click', getRandomUser);
    doubleWealthBtn.addEventListener('click', doubleWealth);
    showMillionairesBtn.addEventListener('click', showMillionaires);
    sortBtn.addEventListener('click', sortData);
    calculateWealthBtn.addEventListener('click', calculateWealth);
}