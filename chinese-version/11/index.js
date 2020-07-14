function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}
// 变量获取部分
const postContainer = $('#post-container');
const loading = $("#loading");
const filter = $("#filter");
const menuEl = $("#menu");
const topEl = $("#top");

let page = 1, limit = 10;
/**
 * 加载
 */
function showLoading() {
    loading.style.opacity = "1";
    setTimeout(() => {
        loading.style.opacity = "0";
        setTimeout(() => {
            page++;
            showPost();
        }, 100)
    }, 1000)
}
/**
 * 请求列表
 */
async function loadPost() {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
    return await res.json();
}
/**
 * 显示列表
 */
async function showPost() {
    const posts = await loadPost();
    // console.log(posts);
    posts.forEach((post, index) => {
        const postEl = document.createElement("div");
        const menuItemEl = postEl.cloneNode(true);
        menuItemEl.classList.add('menu-item');
        if (index === 0) menuItemEl.classList.add('active');
        menuItemEl.setAttribute('data-id', post.id);
        postEl.classList.add("post");
        menuItemEl.innerHTML = `
            <span class="number">${ post.id}.</span>
            <p>${ post.title}</p>
        `;
        postEl.innerHTML = `
            <div class="number" id="post-title-${post.id}">${post.id}</div>
            <div class="post-info">
                <h2>${ post.title}</h2>
                <p class="post-body">${ post.body}</p>
            </div>
        `;
        postContainer.appendChild(postEl);
        menuEl.appendChild(menuItemEl);
    });
    const menuItem = $$('#menu .menu-item');
    const menuItemArr = [].slice.call(menuItem);
    menuItemArr.forEach((menu) => {
        menu.onclick = (e) => {
            menuItemArr.map((item) => {
                item.classList.remove('active');
            })
            e.currentTarget.classList.add('active');
            const data_id = Number(e.currentTarget.dataset.id);
            let totalHeight = $(`#post-title-${data_id}`).getBoundingClientRect().top;
            let scrollTop = document.body.scrollTop = document.documentElement.scrollTop;
            let value = 10, timer = null;
            let updateTop = () => {
                value += 10;
                document.body.scrollTop = document.documentElement.scrollTop = scrollTop + value;
                if (value > (totalHeight + scrollTop)) {
                    if (timer) clearTimeout(timer);
                    document.body.scrollTop = document.documentElement.scrollTop = totalHeight + scrollTop;
                } else {
                    timer = setTimeout(updateTop, 10);
                }
            }
            updateTop();
        }
    })
}
function filterPost(e) {
    const value = e.target.value.toLowerCase();
    const posts = $$(".post");
    const menu_children = menuEl.querySelectorAll('.menu-item');
    posts.forEach((post,index) => {
        const title = post.querySelector('.post-info h2').innerText.toLowerCase();
        const body = post.querySelector('.post-info .post-body').innerText.toLowerCase();
        const expression = title.indexOf(value) > -1 || body.indexOf(value) > -1;
        post.style.display = expression ? 'flex' : 'none';
        menu_children[index].style.display = expression ? 'block' : 'none';
    });
}
showPost();
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement || document.body;
    topEl.style.display = scrollTop + clientHeight >= scrollHeight - 10 ? 'block' : 'none';
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        showLoading();
    }
});

filter.addEventListener('input', filterPost);
topEl.addEventListener('click', () => {
    let value = document.documentElement.scrollTop || document.body.scrollTop, timer = null;
    let updateTop = () => {
        value -= 10;
        document.body.scrollTop = document.documentElement.scrollTop = value;
        if (value < 0) {
            if (timer) clearTimeout(timer);
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            topEl.style.display = "none";
        } else {
            timer = setTimeout(updateTop, 10);
        }
    }
    updateTop();
})