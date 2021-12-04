function Player(genome) {
  this.x = Math.floor(Math.random() * WIDTH);
  this.y = Math.floor(Math.random() * HEIGHT);
  this.vx = 0;
  this.vy = 0;

  this.brain = genome;
  this.brain.score = 0;

  this.area = MIN_AREA;
  this.visualarea = this.area;

  players.push(this);
}

Player.prototype = {
  /** Update the stats */
  update: function () {
    if (this.area > MAX_AREA) this.area = MAX_AREA;
    if (this.area < MIN_AREA) this.area = MIN_AREA;

    const input = this.detect();
    const output = this.brain.activate(input);

    const moveangle = output[0] * 2 * PI;
    const movespeed = output[1] > 1 ? 1 : output[1] < 0 ? 0 : output[1];

    this.vx = movespeed * Math.cos(moveangle) * SPEED;
    this.vy = movespeed * Math.sin(moveangle) * SPEED;

    // Large blobs move slower
    this.vx *= Math.max(1 - this.area / MAX_AREA, MIN_SPEED / SPEED);
    this.vy *= Math.max(1 - this.area / MAX_AREA, MIN_SPEED / SPEED);

    this.x += this.vx;
    this.y += this.vy;

    // Limit position to width and height
    if (WALL_COLLISION) {
      this.x = this.x >= WIDTH ? WIDTH : this.x <= 0 ? 0 : this.x;
      this.y = this.y >= WIDTH ? WIDTH : this.y <= 0 ? 0 : this.y;
    } else {
      this.x = this.x >= WIDTH ? this.x % WIDTH : this.x <= 0 ? this.x + WIDTH : this.x;
      this.y = this.y >= HEIGHT ? this.y % HEIGHT : this.y <= 0 ? this.y + HEIGHT : this.y;
    }

    this.area *= DECREASE_SIZE;

    // Replace highest score to visualize
    this.brain.score = this.area;
    if (this.brain.score > highestScore) {
      highestScore = this.brain.score;
    }
  },

  /** Restart from new position */
  restart: function () {
    this.x = Math.floor(Math.random() * WIDTH);
    this.y = Math.floor(Math.random() * HEIGHT);
    this.vx = 0;
    this.vy = 0;
    this.area = MIN_AREA;
    this.visualarea = this.area;
  },

  /** Display the player on the field */
  show: function () {
    this.visualarea = lerp(this.visualarea, this.area, 0.2);
    const radius = Math.sqrt(this.visualarea / PI);
    const color = activationColor(this.brain.score, highestScore);

    fill(color);
    ellipse(this.x, this.y, radius);
  },

  /** Visualize the detection of the brain */
  showDetection: function (detected) {
    noFill();
    for (const object of detected) {
      if (object != undefined) {
        stroke(object instanceof Player ? "red" : "lightgreen");
        line(this.x, this.y, object.x, object.y);
      }
    }

    const color = activationColor(this.brain.score, highestScore);
    stroke(color);
    ellipse(this.x, this.y, DETECTION_RADIUS * 2);
  },

  /* Checks if object can be eaten */
  eat: function (object) {
    const dist = distance(this.x, this.y, object.x, object.y);

    const radius1 = Math.sqrt(this.area / PI);
    const radius2 = Math.sqrt(object.area / PI);
    if (dist < (radius1 + radius2) / 2 && this.area > object.area * RELATIVE_SIZE) {
      this.area += object.area;
      object.restart();
      return true;
    }
    return false;
  },

  /** Detect other genomes around */
  detect: function () {
    // Detect nearest objects
    const nearestPlayers = [];
    const playerDistances = Array.apply(null, Array(PLAYER_DETECTION)).map(Number.prototype.valueOf, Infinity);

    for (const player of players) {
      if (player == this || this.eat(player)) continue;

      const dist = distance(this.x, this.y, player.x, player.y);
      if (dist < DETECTION_RADIUS) {
        // Check if closer than any other object
        const maxNearestDistance = Math.max.apply(null, playerDistances);
        const index = playerDistances.indexOf(maxNearestDistance);

        if (dist < maxNearestDistance) {
          playerDistances[index] = dist;
          nearestPlayers[index] = player;
        }
      }
    }

    // Detect nearest foods
    const nearestFoods = [];
    const foodDistances = Array.apply(null, Array(FOOD_DETECTION)).map(Number.prototype.valueOf, Infinity);

    for (const food of foods) {
      if (this.eat(food)) continue;

      const dist = distance(this.x, this.y, food.x, food.y);
      if (dist < DETECTION_RADIUS) {
        // Check if closer than any other object
        const maxNearestDistance = Math.max.apply(null, foodDistances);
        const index = foodDistances.indexOf(maxNearestDistance);

        if (dist < maxNearestDistance) {
          foodDistances[index] = dist;
          nearestFoods[index] = food;
        }
      }
    }

    // Create and normalize input
    let output = [this.area / MAX_AREA];

    for (let i = 0; i < PLAYER_DETECTION; i++) {
      const player = nearestPlayers[i];
      const dist = playerDistances[i];

      if (player == undefined) {
        output = output.concat([0, 0, 0]);
      } else {
        output.push(angleToPoint(this.x, this.y, player.x, player.y) / (2 * PI));
        output.push(dist / DETECTION_RADIUS);
        output.push(player.area / MAX_AREA);
      }
    }

    for (let i = 0; i < FOOD_DETECTION; i++) {
      const food = nearestFoods[i];
      const dist = foodDistances[i];

      if (food == undefined) {
        output = output.concat([0, 0]);
      } else {
        output.push(angleToPoint(this.x, this.y, food.x, food.y) / (2 * PI));
        output.push(dist / DETECTION_RADIUS);
      }
    }

    if (distance(mouseX, mouseY, this.x, this.y) < Math.sqrt(this.visualarea / PI)) {
      const detected = nearestPlayers.concat(nearestFoods);
      this.showDetection(detected);
    }

    return output;
  },
};
