const myImage = document.querySelector("img");
let myButton = document.querySelector("button");
let myHeading = document.querySelector("h1");
let sugarCount = 0;
const sugarDisplay = document.getElementById("sugar-count");
let sugarStarted = false;

myImage.addEventListener("click", () => {
  const mySrc = myImage.getAttribute("src");
  if (mySrc === "images/zuzu.jpeg") {
    myImage.setAttribute("src", "images/ai.jpeg");
  } else {
    myImage.setAttribute("src", "images/zuzu.jpeg");
  }

  // Start sugar count display on first click
  if (!sugarStarted) {
    sugarStarted = true;
    sugarDisplay.style.display = "block";
  }

  sugarCount += 1;
  sugarDisplay.textContent = `Sugar Count: ${sugarCount} grams`;
});

function setUserName() {
  const myName = prompt("Please enter your name.");
  if (!myName) {
    setUserName();
  } else {
    localStorage.setItem("name", myName);
    myHeading.textContent = `Meet zuzu, ${myName}`;
  }
}

if (!localStorage.getItem("name")) {
  setUserName();
} else {
  const storedName = localStorage.getItem("name");
  myHeading.textContent = `Meet zuzu, ${storedName}`;
}

myButton.addEventListener("click", () => {
  setUserName();
});
