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

        this.droppedFood = 0;
        this.droppedGuns = 0;
    }

    updateWeight() {
        this.capacity = this.oxen * game.weightPerOx + this.crew * game.weightPerPerson;
        this.weight = this.food * game.foodWeight + this.firepower * game.firePowerWeight;

        while (this.firepower && this.capacity <= this.weight) {
            this.firepower--;
            this.droppedGuns++;

            this.weight -= this.game.firePowerWeight;

            this.ui.notify(`Left ${this.droppedGuns} guns behind`, 'negative');
        };

        while (this.food && this.capacity <= this.weight) {
            this.food--;
            this.droppedFood++;

            this.weight -= this.game.foodWeight;

            this.ui.notify(`Left ${this.droppedFood} food provisions behind`, 'negative');
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
