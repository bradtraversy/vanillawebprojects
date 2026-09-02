let openBtn = document.querySelector("#openBtn");
let closeBtn = document.querySelector("#closeBtn");
let modal = document.querySelector(".modal");
let overlay = document.querySelector(".overlay");

//      OPENING AND CLOSING MODAL

openBtn.addEventListener("click", ()=>{
    // modal.style.display="flex";
    modal.classList.add("show");
    overlay.classList.add("show");
});

closeBtn.addEventListener("click", ()=>{
//     // modal.style.display="none";
    modal.classList.remove("show");
    overlay.classList.remove("show");
})

//      CLOSING ON CLICKING THE ESCAPE BUTTON
document.addEventListener("keydown", (e)=>{
    if(e.key==="Escape"){
        modal.classList.remove("show");
        overlay.classList.remove("show");
    }
})

overlay.addEventListener("click", ()=>{
    overlay.classList.remove("show");
    modal.classList.remove("show");
})