function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}

// 变量获取部分
const musicContainer = $("#music-container");
const playBtn = $("#play");
const prevBtn = $("#prev");
const nextBtn = $("#next");
const songTitleEl = $("#title");
const songCoverEl = $("#cover");

const progressContainer = $("#progress-container");
const progress = $('#progress');
const audio = $("#audio");
const openMusicList = $("#open-music-list");
const musicList = $("#music-list");
const musicTime = $("#music-time");
const mode = $("#mode");
const child = mode.querySelector('.icon');
const songs = [
    {
        name: "她不是真的爱我",
        singer: "白小白",
        imgName: "baixiaobai"
    },
    {
        name: "下雪的季节",
        singer: "本兮",
        imgName: "benxi"
    },
    {
        name: "今生他生",
        singer: "陈启泰",
        imgName: "chenqitai"
    },
    {
        name: "流着泪为你祝福",
        singer: "韩小薰",
        imgName: "hanxiaoxun"
    },
    {
        name: "真爱你的云",
        singer: "黄国俊",
        imgName: "huangguojun"
    },
    {
        name: "车站",
        singer: "李健",
        imgName: "lijian"
    },
    {
        name: "伤了心的女人怎么了",
        singer: "刘涛",
        imgName: "liutao"
    },
    {
        name: "画颜",
        singer: "魏新雨",
        imgName: "weixinyu"
    },
    {
        name: "祝你一路顺风",
        singer: "吴奇隆",
        imgName: "wuqilong"
    },
    {
        name: "回来我的爱",
        singer: "阳一",
        imgName: "yangyi"
    },
    {
        name: "绵阳印象",
        singer: "羽上轩",
        imgName: "yushangxuan"
    },
    {
        name: "滚蛋歌",
        singer: "张翰",
        imgName: "zhanghan"
    },
    {
        name: "烈火青春",
        singer: "张雨生",
        imgName: "zhangyusheng"
    },
    {
        name: "成都",
        singer: "赵雷",
        imgName: "zhaolei"
    },
    {
        name: "歌唱二小放牛郎",
        singer: "杨慧妍",
        imgName: "yanghuiyan"
    },
    {
        name: "我的唇吻不到我爱的人",
        singer: "王奕心",
        imgName: "wangyixin"
    },
    {
        name: "贝多芬的悲伤",
        singer: "萧风",
        imgName: "xiaofeng"
    },
    {
        name: "菊花爆满山",
        singer: "马博",
        imgName: "mabo"
    },
    {
        name: "一亿个伤心",
        singer: "蒙面哥",
        imgName: "mengmiange"
    },
    {
        name: "帝都",
        singer: "萌萌哒天团",
        imgName: "mengmengdatiantuan"
    },
    {
        name: "陪你一起变老",
        singer: "唐古",
        imgName: "tanggu"
    },
    {
        name: "我在前世约了你",
        singer: "唐古",
        imgName: "tanggu"
    },
    {
        name: "恋人心",
        singer: "魏新雨",
        imgName: "weixinyu"
    },
    {
        name: "新娘不是我",
        singer: "程响",
        imgName: "chengxiang"
    }
];
let modeCount = 0;
console.log('歌曲数:',songs.length);
//音乐索引值
let songIndex = 0;
// console.log(songIndex);
loadSongList();
/**
 * 设置音乐时间
 * @param {*} time 
 */
function setMusicTime(time){
    musicTime.innerHTML = '';
    let minute = Math.floor(time / 60),second = Math.floor(time % 60);
    if(minute < 10)minute = '0' + minute;
    if(second < 10)second = '0' + second;
    musicTime.innerHTML = `${ minute } : ${ second }`;
}
/**
 * 加载音乐列表
 */
function loadSongList(){
    musicList.innerHTML = '';
    songs.forEach((song,index) => {
        const musicItem = document.createElement('div');
        musicItem.classList.add('music-item');
        musicItem.setAttribute('data-index',index);
        musicItem.innerHTML = `
            <span>${ song.name }</span>
            <span>-</span>
            <span>${ song.singer }</span>
            <i class="singer-icon" style="background-image:url('https://www.eveningwater.com/my-web-projects/react/1/audioImages/${song.imgName }.jpg')"></i>
        `;
        musicList.appendChild(musicItem);
    });
    const musicItems = musicList.querySelectorAll('.music-item');
    musicItems.forEach((item) => {
        item.addEventListener('click',() => {
            const index = Number(item.dataset.index);
            songIndex = index;
            loadSong(songs[index],index);
            playSong();
        });
    })
}
/**
 * 显示音乐列表
 */
function onOpenMusicList(){
    musicList.classList.toggle('show');
}
/**
 * 加载歌曲
 * @param {*} song 
 * @param {*} index 
 */
function loadSong(song, index) {
    songTitleEl.innerHTML = song.name + '-' + song.singer;
    audio.src = "https://www.eveningwater.com/static/resouces/audio/" + (index + 1) + '.mp3';
    songCoverEl.src = "https://www.eveningwater.com/my-web-projects/react/1/audioImages/" + song.imgName + '.jpg';
}
/**
 * 播放歌曲
 */
function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('.fas').classList.remove('fa-play');
    playBtn.querySelector('.fas').classList.add('fa-pause');
    audio.play();
}
/**
 * 暂停歌曲
 */
function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('.fas').classList.remove('fa-pause');
    playBtn.querySelector('.fas').classList.add('fa-play');
    audio.pause();
}
// 点击播放或暂停
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});
/**
 * 更新进度条
 * @param {*} e 
 */
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration) || isNaN(currentTime)) return;
    // console.log(duration,currentTime);
    const percent = (currentTime / duration) * 100;
    progress.style.width = percent + '%';
    setMusicTime(currentTime);
}
/**
 * 设置进度条
 * @param {*} e 
 */
function setProgress(e) {
    const width = this.offsetWidth;
    const x = e.offsetX;
    const duration = audio.duration;
    const time = (x / width) * duration;
    if (isNaN(time)) return false;
    audio.currentTime = time;
}
// 点击上一首
prevBtn.addEventListener('click', () => {
    songIndex = selectSongByMode(child.className);
    loadSong(songs[songIndex],songIndex);
    playSong();
});
// 点击下一首
nextBtn.addEventListener('click', () => {
    songIndex = selectSongByMode(child.className,true);
    loadSong(songs[songIndex],songIndex);
    playSong();
});
// 歌曲播放完时自动播放下一首
audio.addEventListener('ended', () => {
    songIndex = selectSongByMode(child.className,true);
    loadSong(songs[songIndex],songIndex);
    playSong();
});
// 歌曲播放时更新进度条
audio.addEventListener('timeupdate', updateProgress);
// 设置进度条
progressContainer.addEventListener('click', setProgress);
// 打开音乐列表
openMusicList.addEventListener('click',onOpenMusicList);
mode.addEventListener('click',() => {
    modeCount++;
    const className = child.className.slice(child.className.indexOf('-') - 6);
    // console.log(className);
    setMode(className);
});
/**
 * 设置模式
 * @param {*} className 
 * @param {*} isNext 
 */
function setMode(className){
    // 等于1为单曲循环，2为随机播放，0为顺序播放
    if(modeCount % 3 === 1){
        child.classList.replace(className,'repeat-once');
    }else if(modeCount % 3 === 2){
        child.classList.replace(className,'repeat-random');
    }else{
        child.classList.replace(className,'repeat-cycle');
    }
}
/**
 * 选择歌曲
 * @param {*} mode 
 * @param {*} isNext 
 */
function selectSongByMode(mode,isNext){
    if(mode.indexOf('once') > -1){
        return songIndex;
    }else if(mode.indexOf('random') > -1){
        return songIndex = Math.floor(Math.random() * songs.length);
    }else{
        if(isNext){
            songIndex++;
            if (songIndex > songs.length - 1) {
                songIndex = 0;
            }
        }else{
            songIndex--;
            if(songIndex < 0)songIndex = songs.length - 1;
        }
        return songIndex;
    }
}