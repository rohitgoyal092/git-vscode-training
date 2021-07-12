let defaultSpecs = {
  rows: 20,
  cols: 20,
  fixRow: 5,
  fixCol: 5,
  N: 17,
  M: 15,
};

let inputRows = document.querySelector(".labelBox:nth-child(1) .ibox");
let inputCols = document.querySelector(".labelBox:nth-child(2) .ibox");
let inputFixCols = document.querySelector(".labelBox:nth-child(3) .ibox");
let inputFixRows = document.querySelector(".labelBox:nth-child(4) .ibox");
let inputN = document.querySelector(".labelBox:nth-child(5) .ibox");
let inputM = document.querySelector(".labelBox:nth-child(6) .ibox");
// let scrollToCol = document.querySelector(".labelBox:nth-child(7) .ibox");
// let scrollToRow = document.querySelector(".labelBox:nth-child(8) .ibox");

let cellWidth = "80px",
  cellHeight = "40px";
let cellWidthNP = 80,
  cellHeightNP = 40;

let specs = Object.assign({}, defaultSpecs);

let topLeft = document.querySelector(".topLeft");
let topRight = document.querySelector(".topRight");
let bottomLeft = document.querySelector(".bottomLeft");
let bottomRight = document.querySelector(".bottomRight");

function getStyling(i, j, specs) {
  let s = "";
  s += `<div class = "cellClass">(${i}, ${j})</div>`;
  return s;
}

function styleDivs(specs) {
  let grid = document.querySelector(".grid");
  let w = cellWidthNP * Math.max(specs.M, specs.fixCol + 1);
  w = Math.min(w, cellWidthNP * specs.cols);
  let h = cellHeightNP * Math.max(specs.N, specs.fixRow + 1);
  // console.log(Math.max(specs.N, specs.fixRow + 1));
  h = Math.min(h, cellHeightNP * specs.rows);

  grid.setAttribute("style", `width:${w}px;height:${h}px`);

  topLeft.style.gridTemplateColumns = `repeat(${specs.fixCol}, ${cellWidth})`;
  topLeft.style.gridTemplateRows = `repeat(${specs.fixRow}, ${cellHeight})`;

  topRight.style.gridTemplateColumns = `repeat(${
    specs.cols - specs.fixCol
  }, ${cellWidth})`;
  topRight.style.gridTemplateRows = `repeat(${specs.fixRow}, ${cellHeight})`;

  bottomLeft.style.gridTemplateColumns = `repeat(${specs.fixCol}, ${cellWidth})`;
  bottomLeft.style.gridTemplateRows = `repeat(${
    specs.rows - specs.fixRow
  }, ${cellHeight})`;

  bottomRight.style.gridTemplateColumns = `repeat(${
    specs.cols - specs.fixCol
  }, ${cellWidth})`;
  bottomRight.style.gridTemplateRows = `repeat(${
    specs.rows - specs.fixRow
  }, ${cellHeight})`;
  // console.log(topLeft, topRight, bottomLeft, bottomRight);
}

function build(specs) {
  let grid = document.querySelector(".grid");
  styleDivs(specs);
  let s = "";
  // console.log("topleft");
  for (let i = 0; i < specs.fixRow; i++) {
    for (let j = 0; j < specs.fixCol; j++) {
      s += getStyling(i, j, specs);
    }
  }
  document.querySelector(".topLeft").innerHTML = s;
  s = "";

  // console.log("topRight");
  for (let i = 0; i < specs.fixRow; i++) {
    for (let j = specs.fixCol; j < specs.cols; j++) {
      s += getStyling(i, j, specs);
    }
  }
  document.querySelector(".topRight").innerHTML = s;
  s = "";

  // console.log("bottomLeft");
  for (let i = specs.fixRow; i < specs.rows; i++) {
    for (let j = 0; j < specs.fixCol; j++) {
      s += getStyling(i, j, specs);
    }
  }
  document.querySelector(".bottomLeft").innerHTML = s;
  s = "";

  // console.log("bottomRight");
  for (let i = specs.fixRow; i < specs.rows; i++) {
    for (let j = specs.fixCol; j < specs.cols; j++) {
      s += getStyling(i, j, specs);
    }
  }
  document.querySelector(".bottomRight").innerHTML = s;
  // console.log(s);
  s = "";
}

function resize(specs) {
  build(specs);
}

function setDefault() {
  inputFixCols.setAttribute("value", defaultSpecs.fixCol.toString());
  inputFixRows.setAttribute("value", defaultSpecs.fixRow.toString());
  inputRows.setAttribute("value", defaultSpecs.rows.toString());
  inputCols.setAttribute("value", defaultSpecs.cols.toString());
  inputN.setAttribute("value", defaultSpecs.N.toString());
  inputM.setAttribute("value", defaultSpecs.M.toString());
  // scrollToCol.setAttribute("value", "");
  // scrollToRow.setAttribute("value", "");
}

window.addEventListener("load", (event) => {
  setDefault();
  resize(defaultSpecs);
  // resize(defaultSpecs);
  // resize(defaultSpecs);
});

let topRightScrolled = false,
  bottomRightScrolled = false,
  bottomLeftScrolled = false;

topRight.onscroll = function (event) {
  if (!topRightScrolled) {
    bottomRightScrolled = true;
    bottomRight.scrollLeft = this.scrollLeft;
  }
  topRightScrolled = false;
};
bottomRight.onscroll = function (event) {
  if (!bottomRightScrolled) {
    topRightScrolled = true;
    bottomLeftScrolled = true;
    topRight.scrollLeft = this.scrollLeft;
    bottomLeft.scrollTop = this.scrollTop;
  }
  bottomRightScrolled = false;
};
bottomLeft.onscroll = function (event) {
  if (!bottomLeftScrolled) {
    bottomRightScrolled = true;
    bottomRight.scrollTop = this.scrollTop;
  }
  bottomLeftScrolled = false;
};

function checkDig(str) {
  if (str === null) return true;
  for (let i = 0; i < 10; i++) {
    if (i.toString() == str) return true;
  }
  return false;
}

// inputRows.onkeydown = function (event) {
//   if (event.key == "Backspace" || event.key == "Delete") {
//     if (inputRows.value.length < 1) return false;
//     num = Math.floor(specs.rows / 10);

//     specs.rows = num;
//     specs.fixRow = Math.min(num, specs.fixRow);
//     inputFixRows.value = specs.fixRow;
//     inputRows.value = specs.rows;

//     resize(specs);
//   }
//   if (!checkDig(event.key)) return false;
//   num = 10 * specs.rows + parseInt(event.key);
//   specs.rows = num;
//   resize(specs);
// };

inputCols.addEventListener("input", function (event) {
  if (!checkDig(event.data)) {
    inputCols.value = 0;
    return;
  }
  specs.cols = parseInt(inputCols.value);
  resize(specs);
});

inputRows.addEventListener("input", function (event) {
  if (!checkDig(event.data)) {
    this.value = 0;
    return;
  }
  specs.rows = parseInt(inputRows.value);
  resize(specs);
});

inputN.addEventListener("input", function (event) {
  if (!checkDig(event.data)) {
    this.value = 0;
    return;
  }
  specs.N = parseInt(inputN.value);
  resize(specs);
});

inputM.addEventListener("input", function (event) {
  if (!checkDig(event.data)) {
    this.value = 0;
    return;
  }
  specs.M = parseInt(inputM.value);
  resize(specs);
});

inputFixRows.addEventListener("input", function (event) {
  if (!checkDig(event.data)) {
    this.value = 0;
    return;
  }
  specs.fixRow = parseInt(inputFixRows.value);
  resize(specs);
});

inputFixCols.addEventListener("input", function (event) {
  if (!checkDig(event.data)) {
    this.value = 0;
    return;
  }
  specs.fixCol = parseInt(inputFixCols.value);
  resize(specs);
});

// inputCols.input = function (event) {
//   if (event.key == "Backspace" || event.key == "Delete") {
//     if (inputCols.value.length < 1) return false;
//     num = Math.floor(specs.cols / 10);
//     specs.cols = num;
//     specs.fixCol = Math.min(num, specs.fixCol);
//     inputFixCols.value = specs.fixCol;
//     inputCols.value = specs.cols;
//     resize(specs);
//   }
//   if (!checkDig(event.key)) return false;
//   num = 10 * specs.cols + parseInt(event.key);
//   specs.cols = num;
//   resize(specs);
// };
