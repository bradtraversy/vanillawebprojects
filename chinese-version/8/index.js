

function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}

// 变量获取部分

let submit = $("#submit");
let searchContent = $("#search");
let singleMeal = $("#single-meal");
let resultHeading = $("#result-heading");
let mealsEl = $("#meals");
let random = $("#random");
let translateRes = null;
/**
 * 查询结果
 * @param {*} e 
 */
function searchMeal(e) {
    e.preventDefault();
    // 清空
    singleMeal.innerHTML = "";

    let search_value = searchContent.value;
    // 检查是否输入为空
    if (search_value.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search_value}`).then(res => res.json()).then((data) => {
            // console.log(data);
            resultHeading.innerHTML = `<h2>通过<span style="color:#ff3435;margin:0 5px;font-weight:bold;">${search_value}</span>查询到的结果:</h2>`;

            if (!data.meals) {
                resultHeading.innerHTML = `<p>并没有查找到该结果，请重新输入试试!</p>`;
            } else {
                mealsEl.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="图片加载中" title="膳食缩略图">
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                `).join('')
            }
        })
    } else {
        $message.error("请输入你要查找的膳食!");
        mealsEl.innerHTML = "";
        resultHeading.innerHTML = "";
    }
}

/**
 * 通过id来查询膳食
 * @param {*} id 
 */
function getMealByID(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(res => res.json()).then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    });
}

/**
 * 每种膳食详情信息
 * @param {*} meal 
 */
function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }
    singleMeal.innerHTML = `
        <div class="single-meal">
          <h1>${meal.strMeal}</h1>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
          </div>
          <div class="main">
            <p>${ meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
              ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
          </div>
        </div>
    `;
}
/**
 * 随机获取某种膳食
 */
function getRandomMeal() {
    // 清空
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`).then(res => res.json()).then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    });
}
window.onload = function () {
    submit.addEventListener('submit', searchMeal);
    random.addEventListener('click', getRandomMeal);
    mealsEl.addEventListener('click', (e) => {
        // 找到meal-info元素
        const mealInfo = e.path.find((item) => {
            if (item.classList) {
                return item.classList.contains('meal-info');
            } else {
                return false;
            }
        });
        if (mealInfo) {
            // const mealID = mealInfo.dataset.mealid;
            const mealID = mealInfo.getAttribute('data-mealid');
            // console.log(mealID)
            getMealByID(mealID);
        }
    })
}