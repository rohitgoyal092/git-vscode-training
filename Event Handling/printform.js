const inputBox = document.querySelector(".ageInput .inputBox");
const printSpace = document.querySelector(".outputText");
const submitButton = document.querySelector(".ageInput .submitButton");
const body = document.getElementsByTagName("body")[0];
const insertSpinner = document.querySelector(".insertSpinner");

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  insertSpinner.classList.add("spinner");
  insertSpinner.classList.add("spinner-run");
  // insertSpinner.setAttribute("class", ".spinner-run");
  console.log("Processing");
  setTimeout(() => {
    insertSpinner.classList.remove("spinner-run");
    insertSpinner.classList.remove("spinner");
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
  }, 3000);
});
