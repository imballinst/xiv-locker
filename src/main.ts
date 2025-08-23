import { findClickedShape, type Shape } from "./utils/points";
import "./globals";
import { MAIN_SHAPES } from "./constants";

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

function initMainCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  initCanvasImage(canvas, img);

  for (const shape of MAIN_SHAPES) {
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

  const matchingShape = findClickedShape(MAIN_SHAPES, effectiveX, effectiveY);
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
