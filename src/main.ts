import { findClickedShape, type Shape } from "./utils/points";

// https://stackoverflow.com/a/5932203
function relMouseCoords(event) {
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = this;

  do {
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  } while ((currentElement = currentElement.offsetParent));

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return { x: canvasX, y: canvasY };
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

//
const mainCanvas = document.getElementById("mainCanvas") as HTMLCanvasElement;

async function init() {
  const res = await fetch("./locker.webp");

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // 1080x562
      mainCanvas.width = img.width;
      mainCanvas.height = img.height;
      initCanvasImage(mainCanvas, img);
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

function initCanvasImage(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  if (!img) return;

  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  for (const shape of mainShapes) {
    drawShapeInCanvas(canvas, shape);
  }
}

function initCropCanvas(ctx: CanvasRenderingContext2D) {
  // Draw shapes
  // shapes.forEach((shape) => {
  //   ctx.beginPath();
  //   if (shape.type === "rect") {
  //     ctx.rect(shape.x, shape.y, shape.width, shape.height);
  //   } else {
  //     ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
  //   }
  //   ctx.stroke();
  // });
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
// const fileInput = document.getElementById("fileInput");
//
// fileInput.addEventListener("change", (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const reader = new FileReader();
//   reader.onload = (event) => {
//     img = new Image();
//     img.onload = () => {
//       mainCanvas.width = img.width;
//       mainCanvas.height = img.height;
//       drawCropCanvas();
//     };
//     img.src = event.target.result;
//   };
//   reader.readAsDataURL(file);
// });

// // Mouse events for dragging
// mainCanvas.addEventListener("mousedown", (e) => {
//   if (!img) return;

//   const rect = mainCanvas.getBoundingClientRect();
//   const mouseX = e.clientX - rect.left;
//   const mouseY = e.clientY - rect.top;
//   const mainCtx = mainCanvas.getContext("2d");

//   for (let shape of shapes) {
//     mainCtx.beginPath();
//     if (shape.type === "rect") {
//       mainCtx.rect(shape.x, shape.y, shape.width, shape.height);
//     } else {
//       mainCtx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
//     }

//     if (mainCtx.isPointInPath(mouseX, mouseY)) {
//       draggingShape = shape;
//       offsetX = mouseX - shape.x;
//       offsetY = mouseY - shape.y;
//       drawCropCanvas(shape);
//       break;
//     }
//   }
// });
mainCanvas.addEventListener("mousedown", (e) => {
  // Magic number 3 just because of browsers not sure why
  const matchingShape = findClickedShape(mainShapes, e.clientX, e.clientY - 3);
  console.info(matchingShape);
  console.info("---");
});

// mainCanvas.addEventListener("mousemove", (e) => {
//   if (draggingShape) {
//     const rect = mainCanvas.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     if (draggingShape.type === "rect") {
//       draggingShape.x = mouseX - offsetX;
//       draggingShape.y = mouseY - offsetY;
//     } else {
//       draggingShape.x = mouseX - offsetX;
//       draggingShape.y = mouseY - offsetY;
//     }

//     drawCropCanvas();
//     drawCropCanvas(draggingShape);
//   }
// });

// mainCanvas.addEventListener("mouseup", () => {
//   draggingShape = null;
// });

// mainCanvas.addEventListener("mouseleave", () => {
//   draggingShape = null;
// });
