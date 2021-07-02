const inputBox = document.querySelector(".ageInput .inputBox");
const printSpace = document.querySelector(".outputText");
const submitButton = document.querySelector(".ageInput .submitButton");
const body = document.getElementsByTagName("body")[0];

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (inputBox.value < 0) {
    body.setAttribute("style", "background:rgb(255, 153, 153)");
    setTimeout(() => {
      body.removeAttribute("style");
      console.log("Invalid age");
    }, 2000);
    // body.removeAttribute("style");
    return;
  }
  printSpace.innerText += " " + inputBox.value;
  body.setAttribute("style", "background:rgb(51, 204, 0)");
  setTimeout(() => {
    body.removeAttribute("style");
    console.log("Valid age");
  }, 2000);
});
