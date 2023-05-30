const main = document.querySelector("main");
const voicesSelect = document.getElementById("voices");
const textarea = document.getElementById("text");
const readButton = document.getElementById("read");
const toggleButton = document.getElementById("toggle");
const closeButton = document.getElementById("close");

const data = [ 
  {
    image: "drink",
    text: "Sachin Tendulkar",
    // text: "Don't stop chasing your dreams, because dreams do come true.", //Sachin Tendulkar
  },
  {
    image: "food",
    text: "MS Dhoni",
    // text: "Face the failure, until the failure fails to face you.", //MS Dhoni
  }, 
  {
    image: "tired",
    text: "Virat Kohli",
    // text: "Whatever You Want To Do, Do It With Full Passion, And Work Really Hard Towards It. Don’t Look Anywhere Else", //Virat Kohli
    
  },
  {
    image: "hurt",
    text: "Sourav Ganguly",
    // text: "A captain sees you differently from the way you see yourself. You need a captain who can push you.", //Sourav Ganguly
  },
  {
    image: "happy",
    text: "Rohit Sharma",
    // You need to realize that you must have something to aim for, something to drive you.", //Rohit Sharma
  },
  {
    image: "angry",
    text: "Kapil Dev",
    // text: "If you play good cricket, a lot of bad things get hidden.", //Kapil Dev
  },
  {
    image: "sad",
    text: "Hardik Pandya",
    // text: "// text: "A captain sees you differently from the way you see yourself. You need a captain who can push you.", //Hardik Pandya
  },
  {
    image: "scared",
    text: "Rohit Sharma",
    // text: "Hard work beats talent when talent doesn't work hard.", //Rohit Sharma
  },
  {
    image: "outside",
    text: "Smriti Mandhana",
    // text: "I no longer see myself as a woman cricketer but simply as a cricketer. Why should there be labels when none are required?", //Smriti Mandhana
  },
  {
    image: "home",
    text: "Mithali Raj",
    // text: "The best way to be successful is to be fearless.", //Mithali Raj
  },
  {
    image: "school",
    text: "Suresh Raina",
    // text: "I am not brand conscious. I wear what suits me.", //Suresh Raina
  },
  {
    image: "grandma",
    text: "Harbhajan Singh", 
    // text: "Happiness comes out of contentment, and contentment always comes out of service.", //Harbhajan Singh

  },
];

// https://github.com/bradtraversy/vanillawebprojects/blob/master/speech-text-reader/img/${image}.jpg?raw=true

function createBox(item) {
  const box = document.createElement("div");
  const { image, text } = item;
  box.classList.add("box");
  box.innerHTML = `
    <img src='https://github.com/neeraj542/Speech-Text-Reader-neeraj542/blob/main/img/${image}.jpg?raw=true' alt="${text}"/>
    <p class="info">${text}</p>
    `;
  box.addEventListener("click", () => handleSpeech(text, box));
  main.appendChild(box);
}

data.forEach(createBox);

let voices = [];

function getVoices() {
  voices = speechSynthesis.getVoices();
  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.innerText = `${voice.name} ${voice.lang}`;
    voicesSelect.appendChild(option);
  });
}

function handleSpeech(text, box) {
  setTextMessage(text);
  speakText();
  box.classList.add("active");
  setTimeout(() => box.classList.remove("active"), 800);
}

const message = new SpeechSynthesisUtterance();

function setTextMessage(text) {
  message.text = text;
}

function speakText() {
  speechSynthesis.speak(message);
}

function setVoice(e) {
  message.voice = voices.find((voice) => voice.name === e.target.value);
}

// Event Listeners
toggleButton.addEventListener("click", () => {
  document.getElementById("text-box").classList.toggle("show");
});
closeButton.addEventListener("click", () => {
  document.getElementById("text-box").classList.remove("show");
});
speechSynthesis.addEventListener("voiceschanged", getVoices);
voicesSelect.addEventListener("change", setVoice);
readButton.addEventListener("click", () => {
  setTextMessage(textarea.value);
  speakText();
});

getVoices();