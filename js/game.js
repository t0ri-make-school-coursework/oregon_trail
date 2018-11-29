class Game {
    constructor(gameActive=true, previousTime=null) {
        this.ui = new UI(this);
        this.event = new Event(this);
        this.caravan = new Caravan(this, 0, 0, 30, 80, 2, 300, 2);

        // run variables
        this.gameActive = gameActive;
        this.previousTime = previousTime;

        // constants
        this.weightPerOx = 20;
        this.weightPerPerson = 2;
        this.foodWeight = 0.6;
        this.firePowerWeight = 5;
        this.gameSpeed = 1000;
        this.dayPerStep = 0.2;
        this.foodPerPerson = 0.02;
        this.fullSpeed = 5;
        this.slowSpeed = 3;
        this.finalDistance = 1000;
        this.eventProbability = 0.15;
        this.enemyFirePowerAvg = 5;
        this.enemyGoldAvg = 50;
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
        if (progress >= this.gameSpeed) {
          this.previousTime = timestamp;
          this.updateGame();
        }

        //we use "bind" so that we can refer to the context "this" inside of the step method
        if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
      };

    updateGame() {
        this.caravan.day += this.dayPerStep;

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
        if(this.caravan.distance >= this.finalDistance) {
          this.ui.notify('You have returned home!', 'positive');
          this.gameActive = false;
          return;
        }

        //random events
          if(Math.random() <= this.eventProbability) {
            this.event.generateEvent();
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

let game = new Game();
game.startGame();
