class Game {
    constructor() {
        this.ui = new UI(this);
        this.event = new Event(this);
        this.caravan = new Caravan(0, 0, 30, 80, 2, 300, 2);

        // run variables
        this.gameActive = gameActive;
        this.previousTime = previousTime;

        // constants
        this.WEIGHT_PER_OX = 20;
        this.WEIGHT_PER_PERSON = 2;
        this.FOOD_WEIGHT = 0.6;
        this.FIREPOWER_WEIGHT = 5;
        this.GAME_SPEED = 800;
        this.DAY_PER_STEP = 0.2;
        this.FOOD_PER_PERSON = 0.02;
        this.FULL_SPEED = 5;
        this.SLOW_SPEED = 3;
        this.FINAL_DISTANCE = 1000;
        this.EVENT_PROBABILITY = 0.15;
        this.ENEMY_FIREPOWER_AVG = 5;
        this.ENEMY_GOLD_AVG = 50;
    };

    startGame() {
        this.gameActive = true;
        this.previousTime = null;
        this.ui.notify('A great adventure begins', 'positive');

        this.step();
    }

    step(timestamp) {
        if (!this.previousTime) {
          this.previousTime = timestamp;
          this.updateGame();
        }

        let progress = timestamp - this.previousTime;

        //game update
        if (progress >= this.GAME_SPEED) {
          this.previousTime = timestamp;
          this.updateGame();
        }

        //we use "bind" so that we can refer to the context "this" inside of the step method
        if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
      };

    updateGame() {
        this.caravan.day += this.DAY_PER_STEP;

        this.caravan.consumeFood();

        if(this.caravan.food === 0) {
          this.ui.notify('Your caravan starved to death', 'negative');
          this.gameActive = false;
          return;
        }

        this.caravan.updateWeight();
        this.caravan.updateDistance();

        this.ui.refreshStats();

        // if everyone died
        if(this.caravan.crew <= 0) {
          this.caravan.crew = 0;
          this.ui.notify('Everyone died', 'negative');
          this.gameActive = false;
          return;
        }

        // win game
        if(this.caravan.distance >= this.FINAL_DISTANCE) {
          this.ui.notify('You have returned home!', 'positive');
          this.gameActive = false;
          return;
        }

        //random events
          if(Math.random() <= this.EVENT_PROBABILITY) {
            this.eventManager.generateEvent();
          }
    }

    pauseJourney() {
        this.gameActive = false;
    }

    resumeJourney() {
      this.gameActive = true;
      this.step();
    };

}
