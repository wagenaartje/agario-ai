# Agar.io-AI
This repository shows how you can use [Neataptic](https://github.com/wagenaartje/neataptic) to succesfully teach neural networks to play Agar.io. You can see the genomes live in action [here](https://wagenaartje.github.io/agario-ai/). These genomes have been trained for over 1000 generations, and definetely show sume human-like traits. Visualisation done with [P5.js](https://p5js.org/).

[Read an article on this repo here](https://wagenaartje.github.io/neataptic/articles/agario/). 

## Settings
If you manage to optimize the settings, please perform either a pull request or create an issue [here](https://github.com/wagenaartje/neataptic/issues). 

#### Settings (contained in `js/main.js`):
* `WIDTH` set the width of the playing field
* `HEIGHT` set the height of the playing field
* `MAX_AREA` set the maximal area a genome can acquire
* `MIN_AREA` set the minimal area of a genome
* `RELATIVE_SIZE` set how much migger a genome should be to eat a blob
* `DECREASE_SIZE` set how much area is kept each round
* `DETECTION_RADIUS` set how far a genome can see (pixels)
* `FOOD_DETECTION` set the maximal amount of food blobs a genome can detect
* `PLAYER_DETECTION` set the maximal amount of other genomes a genome can detect
* `MIN_SPEED` set the minimal multiplier speed a genome can have (bigger genomes move slower)
* `MAX_SPEED` set the maximal multiplier speed a genome can have (smaller genomes move faster)
* `FOOD_AREA` set the area of food blobs
* `FOOD_AMOUNT` set the amount of food blobs on the field
* `PLAYER_AMOUNT` set the amount of genomes that play on the field (population size)
* `ITERATIONS` set the amount of iterations/frames each generation is tested for
* `START_HIDDEN_SIZE` set the amount of hidden nodes each genome starts witch
* `MUTATION_RATE` set the mutation rate
* `ELITISM_PERCENT` set the percentage of elitism

Most important setting:
* `USE_TRAINED_POP` setting this to `false` will start the evolution from scratch (USE THIS WHEN OPTIMIZING THE SETTINGS), setting this to `true` will use the pre-trained population

#### Default setting values
```javascript
var WIDTH            = $('#field').width();
var HEIGHT           = 800;

var MAX_AREA         = 10000;
var MIN_AREA         = 400;

var RELATIVE_SIZE    = 1.1;
var DECREASE_SIZE    = 0.998;

var DETECTION_RADIUS = 150;
var FOOD_DETECTION   = 3;
var PLAYER_DETECTION = 3;

var MIN_SPEED        = 0.6;
var SPEED            = 3;

var FOOD_AREA        = 80;
var FOOD_AMOUNT      = Math.round(WIDTH * HEIGHT * 4e-4);

// GA settings
var PLAYER_AMOUNT     = Math.round(WIDTH * HEIGHT * 8e-5);
var ITERATIONS        = 1000;
var START_HIDDEN_SIZE = 0;
var MUTATION_RATE     = 0.3;
var ELITISM_PERCENT   = 0.1;

// Trained population
var USE_TRAINED_POP = true;
```
