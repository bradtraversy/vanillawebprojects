const timerInput = document.querySelector('.timer-input');
timerInput.focus();
const timerButton = document.querySelector('.timer-button');
const timer = document.querySelector('.timer-main');
timerButton.addEventListener('click', () =>{
    if(!Number(timerInput.value)){
        return console.log('Invalid Input');
    }
    let distance = timerInput.value*60*1000;
    timerInput.style.display = 'none';
    timerButton.style.display = 'none';
    const inteval = setInterval(()=>{
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timer.textContent = hours + 'H ' + minutes + 'M ' + seconds + 'S';
        distance -= 1000;
        if(distance < 1000){
            clearInterval(inteval);
            timer.textContent = '!!!!TIME UP!!!!';
        }
    }, 1000);
});