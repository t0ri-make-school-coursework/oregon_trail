class Caravan {
    constructor(game, day, distance, crew, food, oxen, money, firepower) {
        this.game = game;
        this.day = day;
        this.distance = distance;
        this.crew = crew;
        this.food = food;
        this.oxen = oxen;
        this.money = money;
        this.firepower = firepower;
    }

    updateWeight() {
        let droppedFood = 0;
        let droppedGuns = 0;

        this.capacity = this.oxen * game.weightPerOx + this.crew * game.weightPerPerson;
        this.weight = this.food * game.foodWeight + this.firepower * game.firePowerWeight;

        while (this.firepower && this.capacity <= this.weight) {
            this.firepower--;
            droppedGuns++;

            this.weight -= game.firePowerWeight;
        };

        if (droppedGuns) {
            game.ui.notify(`Left ${droppedGuns} guns behind`, 'negative');
        }

        while (this.food && this.capacity <= this.weight) {
            this.food--;
            droppedFood++;

            this.weight -= game.foodWeight;

        }

        if (droppedFood) {
            game.ui.notify(`Left ${droppedFood} food provisions behind`, 'negative');
        }
    }

    updateDistance() {
        let diff = this.capacity - this.weight;
        let speed = game.slowSpeed + diff/this.capacity * game.fullSpeed;

        this.distance += speed
    }

    consumeFood() {
        this.food -= this.crew * this.game.foodPerPerson;

        if (this.food < 0) {
            this.food = 0
        }
    }
}
