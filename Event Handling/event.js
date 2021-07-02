const container = document.querySelector(".container");
const button = document.querySelector(".cta-button");
const posX = document.querySelector(".posX span");
const posY = document.querySelector(".posY span");

console.log(document);
button.addEventListener(
  "click",
  () => {
    button.classList.toggle("active");
    console.log("Button was clicked");
  },
  false
);

const mousePosition = (event) => {
  posX.innerText = event.pageX;
  posY.innerText = event.pageY;
  console.log(event);
};

window.addEventListener("mousemove", mousePosition, false);

container.addEventListener(
  "mouseenter",
  () => {
    container.classList.add("blue");
  },
  false
);
container.addEventListener(
  "mouseleave",
  () => {
    container.classList.remove("blue");
  },
  false
);
