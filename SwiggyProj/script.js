let scrollBox = document.querySelector(".containImg");
let leftButton = document.querySelector(".leftButton");
let rightButton = document.querySelector(".rightButton");
let curItem = 0;
let imgList = scrollBox.children;
let DURATION = 250;
let scrolles = [];

function rightScrollable(ele, off = 0) {
  let scrolled = ele.scrollLeft + off;
  let maxScrollLeft = ele.scrollWidth - ele.clientWidth;
  if (maxScrollLeft - scrolled > Number.EPSILON) {
    return true;
  }
  console.log("NO");
  return false;
}

function leftScrollable(ele, off = 0) {
  let scrolled = ele.scrollLeft;
  if (scrolled - off > Number.EPSILON) {
    return true;
  }
  return false;
}

function getJumpLength(imgList) {
  return (
    parseFloat(
      window.getComputedStyle(imgList[curItem]).getPropertyValue("width")
    ) +
    parseFloat(
      window.getComputedStyle(imgList[curItem]).getPropertyValue("margin-left")
    ) +
    parseFloat(
      window.getComputedStyle(imgList[curItem]).getPropertyValue("margin-right")
    )
  );
}

window.addEventListener("load", function (event) {
  leftButton.style.hidden = "true";
});

rightButton.addEventListener("click", function (event) {
  if (!rightScrollable(scrollBox)) return;
  let scrollAmount = Math.min(
    getJumpLength(imgList),
    scrollBox.scrollWidth - scrollBox.clientWidth - scrollBox.scrollLeft
  );
  scrolles.push(scrollAmount);
  scrollBox.scrollBy({
    top: 0,
    left: scrollAmount,
    behavior: "smooth",
  });
  curItem++;
});

leftButton.addEventListener("click", function (event) {
  if (!leftScrollable(scrollBox)) return;
  curItem--;
  scrollBox.scrollBy({
    top: 0,
    left: -scrolles.pop(),
    behavior: "smooth",
  });
});

rightButton.addEventListener("mouseenter", function (event) {
  rightArrow = document.querySelector(".rightButton .arrowClass");
  rightArrow.animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(1px)" },
      { transform: "translateX(2px)" },
      { transform: "translateX(3px)" },
    ],
    { duration: DURATION, fill: "forwards" }
  );
});

rightButton.addEventListener("mouseleave", function (event) {
  rightArrow = document.querySelector(".rightButton .arrowClass");
  rightArrow.animate([{ transform: "translateX(0px)" }], {
    duration: DURATION,
    fill: "forwards",
  });
  rightArrow.style.zIndex = "auto";
});

leftButton.addEventListener("mouseenter", function (event) {
  leftArrow = document.querySelector(".leftButton .arrowClass");
  leftArrow.animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(-1px)" },
      { transform: "translateX(-2px)" },
      { transform: "translateX(-3px)" },
    ],
    { duration: DURATION, fill: "forwards" }
  );
});
leftButton.addEventListener("mouseleave", function (event) {
  leftArrow = document.querySelector(".leftButton .arrowClass");
  leftArrow.animate([{ transform: "translateX(0px)" }], {
    duration: DURATION,
    fill: "forwards",
  });
  leftArrow.style.zIndex = "auto";
});
