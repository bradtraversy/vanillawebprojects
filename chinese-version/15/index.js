function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}
HTMLElement.prototype.hasClass = function (className) {
    return new RegExp(" " + className + " ").test(' ' + this.className + ' ');
}
const result = $("#song-result");
const searchBtn = $("#search-btn");
const songText = $("#song-text");
const pageEl = $("#pagination");
// 网易云音乐API
const baseSearchAPI = "https://v1.alapi.cn/api/music/search";
const baseDetailAPI = "https://api.imjad.cn/cloudmusic/?type=lyric";
let currentPage = 1;
let pageSize = 20;
let searchValue = "";
function resetResult() {
    return result.innerHTML = `<p>这里将会显示歌曲搜索的结果!</p>`;
}
resetResult();
// 点击搜索按钮搜索歌曲
searchBtn.addEventListener('click', () => {
    if (!songText.value.trim()) return $message.error("请输入歌曲名!");
    searchValue = songText.value;
    searchSong(searchValue);
    songText.value = "";
});
/**
 * 搜索歌曲
 * @param {*} value 
 */
async function searchSong(value) {
    // console.log(currentPage);
    const res = await fetch(baseSearchAPI + '?keyword=' + value + '&limit=' + pageSize + '&offset=' + currentPage);
    const data = await res.json();
    // console.log(data);
    showResultData(data.data.songs);
}
/**
 * 显示所有歌曲结果
 * @param {*} data 
 */
function showResultData(data) {
    result.innerHTML = '';
    const ulItem = document.createElement('ul');
    ulItem.classList.add("songs");
    data.forEach(song => {
        const songItem = document.createElement('li');
        songItem.innerHTML = `
        <span>
            ${ song.name}-
            <b>${ song.artists[0].name}</b>
        </span>
        <button type="button" class="get-lyric-btn btn" data-id=${song.id}>获取歌词</button>`;
        ulItem.appendChild(songItem);
    });
    result.appendChild(ulItem);
    loadPage();
    result.querySelectorAll(".get-lyric-btn").forEach(item => {
        item.addEventListener('click', () => {
            const songID = item.getAttribute('data-id');
            const songInfo = item.previousElementSibling.innerText;
            fetch(baseDetailAPI + '&id=' + songID).then(res => res.json()).then(data => {
                if(data.lrc){
                    const filter_lyric = data.lrc.lyric.replace(/\[.*?\]/g,'').trim().replace(/(\r\n|\r|\n)/g, (word) => {
                        return word + '，<br>';
                    }) + '。';
                    result.innerHTML = `<h2>${ songInfo }</h2><p>${filter_lyric}</p>`;
                    pageEl.innerHTML = '';
                }else{
                    return $message.error("暂未找到歌词!");
                }
            })
        })
    })
}
/**
 * 加载上一页与下一页
 */
function loadPage() {
    if (currentPage <= 1) {
        pageEl.innerHTML = `<button type="button" class="btn next-page-btn">下一页</button>`;
    } else {
        pageEl.innerHTML = `<button type="button" class="btn prev-page-btn">上一页</button>
        <button type="button" class="btn next-page-btn">下一页</button>`;
    }
}
// 上一页与下一页
pageEl.addEventListener('click', (e) => {
    // console.log(e.target);
    if (e.target.tagName.toLowerCase() === 'button') {
        if (e.target.hasClass('next-page-btn')) {
            currentPage++;
            searchSong(searchValue);
        } else {
            currentPage--;
            if (currentPage < 1) currentPage = 1;
            searchSong(searchValue);
        }
    }
})