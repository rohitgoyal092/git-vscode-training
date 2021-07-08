let scrollBox = document.querySelector(".containImg");
let leftButton = document.querySelector(".leftButton");
let rightButton = document.querySelector(".rightButton");
let imgList = scrollBox.children;

// window.addEventListener("load", function (event) {
//   if (rightScrollable(scrollBox) === false) {
//     rightButton.hidden = true;
//   }
//   leftButton.hidden = true;
// });

function rightScrollable(ele, len) {
  let scrolled = ele.scrollLeft;
  let maxScrollLeft = ele.scrollWidth - ele.clientWidth;
  // console.log("scrolled : ", scrolled);
  // console.log("total : ", maxScrollLeft);
  if (maxScrollLeft - scrolled >= 0) {
    return true;
  }
  // console.log("cannot!!");
  return false;
}

function leftScrollable(ele) {
  let scrolled = ele.scrollLeft;
  if (scrolled > 0) {
    return true;
  }
  return false;
}

function getJumpLength(imgList) {
  return (
    parseFloat(window.getComputedStyle(imgList[0]).getPropertyValue("width")) +
    parseFloat(
      window.getComputedStyle(imgList[0]).getPropertyValue("margin-left")
    ) +
    parseFloat(
      window.getComputedStyle(imgList[0]).getPropertyValue("margin-right")
    )
  );
}

rightButton.addEventListener("click", function (event) {
  if (!rightScrollable(scrollBox, getJumpLength(imgList))) return;
  scrollBox.scrollLeft += getJumpLength(imgList);
});

leftButton.addEventListener("click", function (event) {
  if (!leftScrollable(scrollBox, getJumpLength(imgList))) return;
  scrollBox.scrollLeft -= getJumpLength(imgList);
});

rightButton.addEventListener("mouseover", function (event) {
  rightArrow = document.querySelector(".rightButton .arrowClass");
  rightArrow.animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(2px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(8px)" },
    ],
    { duration: 250, fill: "forwards" }
  );
});
rightButton.addEventListener("mouseleave", function (event) {
  rightArrow = document.querySelector(".rightButton .arrowClass");
  rightArrow.animate([{ transform: "translateX(0px)" }], {
    duration: 1,
    fill: "forwards",
  });
});

leftButton.addEventListener("mouseover", function (event) {
  leftArrow = document.querySelector(".leftButton .arrowClass");
  leftArrow.animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(-2px)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(-8px)" },
    ],
    { duration: 250, fill: "forwards" }
  );
});
leftButton.addEventListener("mouseleave", function (event) {
  leftArrow = document.querySelector(".leftButton .arrowClass");
  leftArrow.animate([{ transform: "translateX(0px)" }], {
    duration: 1,
    fill: "forwards",
  });
});
