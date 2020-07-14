function $(selector) {
    return document.querySelector(selector);
}
const showRuleBtn = $('#show-rule-btn');
const closeRuleBtn = $('#close-rule-btn');
const rules = $("#rules");
const canvas = $('#canvas');
const ctx = canvas.getContext('2d');

// 初始得分
let score = 0;
// 初始砖块行数与列数
let brickRowCount = 9;
let brickColumnCount = 6;
// 初始化小球对象
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: 10,
    speed: 3,
    dx: 4,
    dy: -4
};
/**
 * 画小球
 */
function drawBall() {
    ctx.beginPath();
    // api:https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}
// 初始化球拍
let paddle = {
    w: 100,
    h: 10,
    x: canvas.width / 2 - 80,
    y: canvas.height - 20,
    dx: 0,
    speed: 10
};
/**
 * 画球拍
 */
function drawPaddle() {
    ctx.beginPath();
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}
// 初始化砖块对象
let brickObj = {
    w: 70,
    h: 20,
    visible: true,
    padding: 10,
    offsetX: 45,
    offsetY: 60
};
// 砖块数组
let bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        // 每一个砖块的x坐标与y坐标
        const x = i * (brickObj.w + brickObj.padding) + brickObj.offsetX;
        const y = j * (brickObj.h + brickObj.padding) + brickObj.offsetY;

        bricks[i][j] = { x, y, ...brickObj };
    }
}
// console.log(bricks);
/**
 * 画砖块
 */
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? "#0095dd" : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}
/**
 * 画分
 */
function drawScore() {
    ctx.font = "23px 微软雅黑";
    // api:https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText
    ctx.fillText(`得分:${score}`, canvas.width - 120, 40);
}
/**
 * 显示所有砖块
 */
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => brick.visible = true);
    })
}
function draw() {
    // api:https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}
/**
 * 得分
 */
function increaseScore() {
    score++;
    // 当砖块全部消除完时，重置砖块与分数
    if (score % (brickRowCount * brickColumnCount) === 0) {
        showAllBricks();
    }
}
/**
 * 移动球拍
 */
function movePaddle() {
    paddle.x += paddle.dx;
    // 坐标临界值判断
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
}
/**
 * 移动球
 */
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 与墙的碰撞检测,左右方向
    if (ball.x > canvas.width - ball.r || ball.x - ball.r < 0) {
        // 将dx坐标往相反方向移动
        ball.dx *= -1;
    }
    // 上下方向
    if (ball.y > canvas.height - ball.r || ball.y - ball.r < 0) {
        // 将dy坐标往相反方向移动
        ball.dy *= -1;
    }
    // 与球拍的碰撞检测
    if (ball.x + ball.r > paddle.x && ball.x + ball.r < paddle.x + paddle.w && ball.y + ball.r > paddle.y) {
        ball.dy = -ball.speed;
    }
    // 与砖块的碰撞检测
    bricks.forEach(column => {
        column.forEach(brick => {
            // 砖块显示的时候才消除,在这些边界之内就视为碰撞
            if (brick.visible) {
                if (ball.x - ball.r > brick.x && //左边的边界
                    ball.x + ball.r < brick.x + brick.w && //右边的边界
                    ball.y + ball.r > brick.y && //上边的边界
                    ball.y - ball.r < brick.y + brick.h //下边的边界
                ) {
                    ball.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        })
    })
    // 如果碰到canvas底部并且没有碰到球拍，则游戏结束
    if (ball.y + ball.r > canvas.height) {
        showAllBricks();
        score = 0;
    }
}
/**
 * 游戏开始
 */
function update() {
    moveBall();
    movePaddle();
    draw();
    window.requestAnimationFrame(update);
}
update();
/**
 * 按下键盘左右移动球拍
 * @param {*} e 
 */
function handleKeyDown(e) {
    // console.log(e.key);
    const key = e.key;
    if (key === "ArrowLeft" || key === "Left") {
        paddle.dx = -paddle.speed;
    } else if (key === 'ArrowRight' || key === "Right") {
        paddle.dx = paddle.speed;
    }
}
/**
 * 重置球拍
 * @param {*} e 
 */
function handleKeyUp(e) {
    const key = e.key;
    if (key === 'ArrowRight' || key === "ArrowLeft" || key === "Left" || key === "Right") {
        paddle.dx = 0;
    }
}
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
// 开启与关闭规则介绍
[showRuleBtn, closeRuleBtn].forEach((btn, index) => {
    btn.addEventListener('click', () => {
        rules.style.transform = index > 0 ? "translateX(-100%)" : "translateX(0)";
    });
});
// 点击遮罩关闭规则介绍
rules.addEventListener('click', (e) => {
    // console.log(e.target.className);
    if (e.target.className.indexOf('rules') > -1) {
        rules.style.transform = "translateX(-100%)";
    }
});
