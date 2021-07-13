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
let inputFixRows = document.querySelector(".labelBox:nth-child(3) .ibox");
let inputFixCols = document.querySelector(".labelBox:nth-child(4) .ibox");
let inputN = document.querySelector(".labelBox:nth-child(5) .ibox");
let inputM = document.querySelector(".labelBox:nth-child(6) .ibox");

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
  s += `<div class = "cellClass">${i}, ${j}</div>`;
  return s;
}

function resetStyle() {
  if (topLeft.hasAttribute(style)) {
    topLeft.removeAttribute(style);
  }
  if (topRight.hasAttribute(style)) {
    topRight.removeAttribute(style);
  }
  if (bottomLeft.hasAttribute(style)) {
    bottomLeft.removeAttribute(style);
  }
  if (bottomRight.hasAttribute(style)) {
    bottomRight.removeAttribute(style);
  }
}

function setNull(corner) {
  corner.setAttribute(
    "style",
    "grid-template-columns:repeat(1,0px);grid-template-rows:repeat(1,0px);border:none"
  );
}

function styleDivs(specs) {
  let grid = document.querySelector(".grid");
  let w = cellWidthNP * Math.max(specs.M, specs.fixCol + 1);
  w = Math.min(w, cellWidthNP * specs.cols);
  let h = cellHeightNP * Math.max(specs.N, specs.fixRow + 1);
  h = Math.min(h, cellHeightNP * specs.rows);

  grid.setAttribute("style", `width:${w}px;height:${h}px`);
  // resetStyle();

  if (Math.min(specs.fixCol, specs.fixRow) > 0) {
    topLeft.style.gridTemplateColumns = `repeat(${specs.fixCol}, ${cellWidth})`;
    topLeft.style.gridTemplateRows = `repeat(${specs.fixRow}, ${cellHeight})`;
    topLeft.style.removeProperty("border");
  } else {
    setNull(topLeft);
  }

  if (Math.min(specs.cols - specs.fixCol, specs.fixRow) > 0) {
    topRight.style.gridTemplateColumns = `repeat(${
      specs.cols - specs.fixCol
    }, ${cellWidth})`;
    topRight.style.gridTemplateRows = `repeat(${specs.fixRow}, ${cellHeight})`;
    topRight.style.removeProperty("border");
  } else {
    setNull(topRight);
  }

  if (Math.min(specs.fixCol, specs.rows - specs.fixRow) > 0) {
    bottomLeft.style.gridTemplateColumns = `repeat(${specs.fixCol}, ${cellWidth})`;
    bottomLeft.style.gridTemplateRows = `repeat(${
      specs.rows - specs.fixRow
    }, ${cellHeight})`;
    bottomLeft.style.removeProperty("border");
  } else {
    setNull(bottomLeft);
  }

  if (Math.min(specs.cols - specs.fixCol, specs.rows - specs.fixRow) > 0) {
    bottomRight.style.gridTemplateColumns = `repeat(${
      specs.cols - specs.fixCol
    }, ${cellWidth})`;
    bottomRight.style.gridTemplateRows = `repeat(${
      specs.rows - specs.fixRow
    }, ${cellHeight})`;
    bottomRight.style.removeProperty("border");
  } else {
    setNull(bottomRight);
  }
}

function build(specs) {
  let grid = document.querySelector(".grid");
  let s = "";
  styleDivs(specs);

  for (let i = 0; i < specs.fixRow; i++) {
    for (let j = 0; j < specs.fixCol; j++) {
      s += getStyling(i, j, specs);
    }
  }
  document.querySelector(".topLeft").innerHTML = s;
  s = "";

  for (let i = 0; i < specs.fixRow; i++) {
    for (let j = specs.fixCol; j < specs.cols; j++) {
      s += getStyling(i, j, specs);
    }
  }

  document.querySelector(".topRight").innerHTML = s;
  s = "";

  for (let i = specs.fixRow; i < specs.rows; i++) {
    for (let j = 0; j < specs.fixCol; j++) {
      s += getStyling(i, j, specs);
    }
  }
  document.querySelector(".bottomLeft").innerHTML = s;
  s = "";

  for (let i = specs.fixRow; i < specs.rows; i++) {
    for (let j = specs.fixCol; j < specs.cols; j++) {
      s += getStyling(i, j, specs);
    }
  }

  document.querySelector(".bottomRight").innerHTML = s;
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
}

window.addEventListener("load", (event) => {
  setDefault();
  resize(defaultSpecs);
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

let validRegex = /^[0-9]+$/;

function checkValidNumber(str, event) {
  if (event.data === "+" || event.data === "-") {
    return false;
  }
  if (str.length < 1) {
    return true;
  }
  if (str.match(validRegex)) {
    return true;
  }
  return false;
}

function getVal(str) {
  if (str.length === 0) {
    return 0;
  }
  return parseInt(str);
}

inputRows.addEventListener("input", function (event) {
  if (!checkValidNumber(this.value, event)) {
    specs.rows = 0;
    this.value = 0;
  } else if (this.value.length < 1) {
    specs.rows = 0;
  } else {
    specs.rows = parseInt(this.value);
  }
  specs.rows = Math.max(specs.rows, specs.fixRow);
  resize(specs);
});

inputCols.addEventListener("input", function (event) {
  if (!checkValidNumber(this.value, event)) {
    specs.cols = 0;
    this.value = 0;
  } else if (this.value.length < 1) {
    specs.cols = 0;
  } else {
    specs.cols = parseInt(this.value);
  }
  specs.cols = Math.max(specs.cols, specs.fixCol);
  resize(specs);
});

inputFixRows.addEventListener("input", function (event) {
  if (!checkValidNumber(this.value, event)) {
    specs.fixRow = 0;
    this.value = 0;
  } else if (this.value.length < 1) {
    specs.fixRow = 0;
  } else {
    specs.fixRow = parseInt(this.value);
  }
  specs.rows = Math.max(getVal(inputRows.value), specs.fixRow);
  resize(specs);
});

inputFixCols.addEventListener("input", function (event) {
  if (!checkValidNumber(this.value, event)) {
    specs.fixCol = 0;
    this.value = 0;
  } else if (this.value.length < 1) {
    specs.fixCol = 0;
  } else {
    specs.fixCol = parseInt(this.value);
  }
  specs.cols = Math.max(getVal(inputCols.value), specs.fixCol);
  resize(specs);
});

inputN.addEventListener("input", function (event) {
  if (!checkValidNumber(this.value, event)) {
    specs.N = 0;
    this.value = 0;
  } else if (this.value.length < 1) {
    specs.N = 0;
  } else {
    specs.N = parseInt(this.value);
  }
  specs.N = Math.min(specs.N, specs.rows);
  resize(specs);
});

inputM.addEventListener("input", function (event) {
  if (!checkValidNumber(this.value, event)) {
    specs.M = 0;
    this.value = 0;
  } else if (this.value.length < 1) {
    specs.M = 0;
  } else {
    specs.M = parseInt(this.value);
  }
  specs.M = Math.min(specs.M, specs.cols);
  resize(specs);
});
