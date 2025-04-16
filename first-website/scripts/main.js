const myImage = document.querySelector("img");

myImage.addEventListener("click", () => {
  const mySrc = myImage.getAttribute("src");
  if (mySrc === "images/zuzu.jpg") {
    myImage.setAttribute("src", "images/firefox-icon.png");
  } else {
    myImage.setAttribute("src", "zuzu.jpeg");
  }
});
