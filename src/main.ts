import { findClickedShape, type Shape } from "./utils/points";

declare global {
  interface HTMLCanvasElement {
    relMouseCoords(event: MouseEvent): { x: number; y: number };
  }
}
HTMLCanvasElement.prototype.relMouseCoords = function (event) {
  // https://stackoverflow.com/a/5932203
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement: HTMLElement = this;

  do {
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  } while ((currentElement = currentElement.offsetParent as HTMLElement));

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return { x: canvasX, y: canvasY };
};

//
const mainCanvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
const cropCanvas = document.getElementById("cropCanvas") as HTMLCanvasElement;
let currentlySelectedShapeIndex: number | undefined = undefined;

async function init() {
  const res = await fetch("./locker.webp");

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // 1080x562
      mainCanvas.width = img.width;
      mainCanvas.height = img.height;
      initMainCanvas(mainCanvas, img);
    };
    img.src = event.target!.result as string;
  };
  reader.readAsDataURL(await res.blob());
}

init();

const mainShapes: Shape[] = [
  {
    type: "points",
    points: [
      { x: 312, y: 5 },
      { x: 323, y: 140 },
      { x: 395, y: 140 },
      { x: 390, y: 8 },
    ],
  },
  {
    type: "points",
    points: [
      { x: 328, y: 187 },
      { x: 407, y: 185 },
      { x: 411, y: 283 },
      { x: 334, y: 289 },
    ],
  },
  {
    type: "points",
    points: [
      { x: 400, y: 0 },
      { x: 520, y: 0 },
      { x: 520, y: 160 },
      { x: 406, y: 160 },
    ],
  },
  {
    type: "points",
    points: [
      { x: 555, y: 28 },
      { x: 666, y: 0 },
      { x: 670, y: 0 },
      { x: 655, y: 335 },
      { x: 552, y: 283 },
    ],
  },
  {
    type: "points",
    points: [
      { x: 428, y: 175 },
      { x: 522, y: 170 },
      { x: 524, y: 288 },
      { x: 452, y: 296 },
      { x: 440, y: 288 },
      { x: 434, y: 287 },
    ],
  },
  {
    type: "points",
    points: [
      { x: 463, y: 306 },
      { x: 518, y: 298 },
      { x: 519, y: 376 },
      { x: 484, y: 382 },
      { x: 482, y: 323 },
    ],
  },
  {
    type: "points",
    points: [
      { x: 738, y: 182 },
      { x: 911, y: 202 },
      { x: 871, y: 512 },
      { x: 723, y: 423 },
    ],
  },
];

function initMainCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  initCanvasImage(canvas, img);

  for (const shape of mainShapes) {
    drawShapeInCanvas(canvas, shape);
  }
}

function initCanvasImage(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!img) return;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function drawShapeInCanvas(canvas: HTMLCanvasElement, shape: Shape) {
  const ctx = canvas.getContext("2d")!;

  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;

  ctx.beginPath();

  for (let i = 0; i < shape.points.length; i++) {
    const point = shape.points[i];
    let nextPoint = shape.points[i + 1];
    if (!nextPoint) nextPoint = shape.points[0];

    ctx.moveTo(point.x, point.y);
    ctx.lineTo(nextPoint.x, nextPoint.y);
  }

  ctx.stroke();
}

// Upload image
//
const fileInput = document.getElementById("fileInput") as HTMLInputElement;
const images: HTMLImageElement[] = [];

fileInput.addEventListener("change", (e) => {
  const file = (e.target as HTMLInputElement).files![0];
  console.info(currentlySelectedShapeIndex, file);
  if (!file || currentlySelectedShapeIndex === undefined) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      cropCanvas.width = img.width;
      cropCanvas.height = img.height;
    };
    img.src = event.target!.result as string;

    images[currentlySelectedShapeIndex!] = img;
  };
  reader.readAsDataURL(file);
});

mainCanvas.addEventListener("mousedown", (e) => {
  // Magic number 3 just because of browsers not sure why
  const effectiveX = e.clientX + window.scrollX;
  const effectiveY = e.clientY + window.scrollY - 3;

  const matchingShape = findClickedShape(mainShapes, effectiveX, effectiveY);
  currentlySelectedShapeIndex = matchingShape;
  console.info(
    currentlySelectedShapeIndex,
    e.clientX,
    e.clientY,
    window.scrollX,
    window.scrollY,
    images[currentlySelectedShapeIndex!]
  );

  initCanvasImage(cropCanvas, images[currentlySelectedShapeIndex!]);
});
