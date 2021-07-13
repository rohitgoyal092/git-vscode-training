const defaultSpecs = {
  rows: 20,
  cols: 20,
  fixRow: 5,
  fixCol: 5,
  N: 17,
  M: 15,
};

const cellWidth = 80,
  cellHeight = 40;

let inputRows = document.querySelector(".labelBox:nth-child(1) .ibox");
let inputCols = document.querySelector(".labelBox:nth-child(2) .ibox");
let inputFixRows = document.querySelector(".labelBox:nth-child(3) .ibox");
let inputFixCols = document.querySelector(".labelBox:nth-child(4) .ibox");
let inputN = document.querySelector(".labelBox:nth-child(5) .ibox");
let inputM = document.querySelector(".labelBox:nth-child(6) .ibox");

let specs = Object.assign({}, defaultSpecs);

let topLeft = document.querySelector(".topLeft");
let topRight = document.querySelector(".topRight");
let bottomLeft = document.querySelector(".bottomLeft");
let bottomRight = document.querySelector(".bottomRight");

function getStyling(i, j, specs) {
  let s = `<div class = "cellClass">${i}, ${j}</div>`;
  return s;
}

function setNull(corner) {
  corner.setAttribute(
    "style",
    "grid-template-columns:repeat(1,0px);grid-template-rows:repeat(1,0px);border:none"
  );
}

function resizeGrid(specs) {
  let grid = document.querySelector(".grid");
  let w = cellWidth * Math.max(specs.M, specs.fixCol + 1);
  w = Math.min(w, cellWidth * specs.cols);
  let h = cellHeight * Math.max(specs.N, specs.fixRow + 1);
  h = Math.min(h, cellHeight * specs.rows);

  grid.setAttribute("style", `width:${w}px;height:${h}px`);
}

function styleDivs(specs) {
  resizeGrid(specs);

  if (Math.min(specs.fixCol, specs.fixRow) > 0) {
    topLeft.style.gridTemplateColumns = `repeat(${specs.fixCol}, ${cellWidth}px)`;
    topLeft.style.gridTemplateRows = `repeat(${specs.fixRow}, ${cellHeight}px)`;
    topLeft.style.removeProperty("border");
  } else {
    setNull(topLeft);
  }

  if (Math.min(specs.cols - specs.fixCol, specs.fixRow) > 0) {
    topRight.style.gridTemplateColumns = `repeat(${
      specs.cols - specs.fixCol
    }, ${cellWidth}px)`;
    topRight.style.gridTemplateRows = `repeat(${specs.fixRow}, ${cellHeight}px)`;
    topRight.style.removeProperty("border");
  } else {
    setNull(topRight);
  }

  if (Math.min(specs.fixCol, specs.rows - specs.fixRow) > 0) {
    bottomLeft.style.gridTemplateColumns = `repeat(${specs.fixCol}, ${cellWidth}px)`;
    bottomLeft.style.gridTemplateRows = `repeat(${
      specs.rows - specs.fixRow
    }, ${cellHeight}px)`;
    bottomLeft.style.removeProperty("border");
  } else {
    setNull(bottomLeft);
  }

  if (Math.min(specs.cols - specs.fixCol, specs.rows - specs.fixRow) > 0) {
    bottomRight.style.gridTemplateColumns = `repeat(${
      specs.cols - specs.fixCol
    }, ${cellWidth}px)`;
    bottomRight.style.gridTemplateRows = `repeat(${
      specs.rows - specs.fixRow
    }, ${cellHeight}px)`;
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
  console.log("topRight", topRightScrolled);
  if (!topRightScrolled) {
    bottomRightScrolled = true;
    bottomRight.scrollLeft = this.scrollLeft;
  }
  topRightScrolled = false;
};
bottomRight.onscroll = function (event) {
  console.log("bottomRight", bottomRightScrolled);
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

function getInputFieldValue(inputField, event) {
  let retVal = 0;
  if (!checkValidNumber(inputField.value, event)) {
    retVal = 0;
    inputField.value = 0;
  } else if (inputField.value.length < 1) {
    retVal = 0;
  } else {
    retVal = getVal(inputField.value);
  }
  return retVal;
}

inputRows.addEventListener("input", function (event) {
  specs.rows = Math.max(getInputFieldValue(this, event), specs.fixRow);
  resize(specs);
});

inputCols.addEventListener("input", function (event) {
  specs.cols = Math.max(getInputFieldValue(this, event), specs.fixCol);
  resize(specs);
});

inputFixRows.addEventListener("input", function (event) {
  specs.fixRow = getInputFieldValue(this, event);
  specs.rows = Math.max(getVal(inputRows.value), specs.fixRow);
  resize(specs);
});

inputFixCols.addEventListener("input", function (event) {
  specs.fixCol = getInputFieldValue(this, event);
  specs.cols = Math.max(getVal(inputCols.value), specs.fixCol);
  resize(specs);
});

inputN.addEventListener("input", function (event) {
  specs.N = Math.min(getInputFieldValue(this, event), specs.rows);
  resize(specs);
});

inputM.addEventListener("input", function (event) {
  specs.M = Math.min(getInputFieldValue(this, event), specs.cols);
  resize(specs);
});
