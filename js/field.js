/* Global vars */
var players = [];
var foods = [];
var iteration = 0;
var highestScore = 0;

/** Setup the canvas */
function setup() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("field");
  initNeat();

  // Create some food
  for (let i = 0; i < FOOD_AMOUNT; i++) {
    new Food();
  }

  // Do some initial mutation
  if (!USE_TRAINED_POP) {
    for (let i = 0; i < 100; i++) neat.mutate();
  }

  startEvaluation();
}

function draw() {
  clear();
  squareGrid();

  // Check if evaluation is done
  if (iteration == ITERATIONS) {
    endEvaluation();
    iteration = 0;
  }

  // Update and visualise players
  for (let i = players.length - 1; i >= 0; i--) {
    const player = players[i];

    // Some players are eaten during the iteration
    player.update();
    player.show();
  }

  // Update and visualise food
  for (let i = foods.length - 1; i >= 0; i--) {
    foods[i].show();
  }

  iteration++;
}

/** Draw a square grid with grey lines */
function squareGrid() {
  stroke(204, 204, 204, 160);
  fill(255);
  for (let x = 0; x < WIDTH / 40; x++) {
    line(x * 40, 0, x * 40, HEIGHT);
  }
  for (let y = 0; y < HEIGHT / 40; y++) {
    line(0, y * 40, WIDTH, y * 40);
  }
  noStroke();
}

/** Calculate distance between two points */
function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

/** Get a relative color between red and green */
var activationColor = function (value, max) {
  const power = 1 - Math.min(value / max, 1);
  const color = [255, 255, 0];

  if (power < 0.5) {
    color[0] = 2 * power * 255;
  } else {
    color[1] = (1.0 - 2 * (power - 0.5)) * 255;
  }

  return color;
};

/** Get the angle from one point to another */
function angleToPoint(x1, y1, x2, y2) {
  const d = distance(x1, y1, x2, y2);
  const dx = (x2 - x1) / d;
  const dy = (y2 - y1) / d;

  return dy < 0 ? 2 * Math.PI - Math.acos(dx) : Math.acos(dx);
}
