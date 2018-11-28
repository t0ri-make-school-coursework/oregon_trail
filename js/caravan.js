class Caravan {
    constructor(day, distance, crew, food, oxen, money, firepower) {
        this.day = day;
        this.distance = distance;
        this.crew = crew;
        this.food = food;
        this.oxen = oxen;
        this.money = money;
        this.firepower = firepower;

        this.droppedFood = 0;
        this.droppedGuns = 0;

        this.capacity = this.oxen * OregonH.weightPerOx + this.crew * OregonH.weightPerPerson;;
        this.weight = this.food * OregonH.foodWeight + this.firepower * OregonH.firePowerWeight;
    }

    updateWeight() {
        while (this.firepower && this.capacity <= this.weight) {
            this.firepower--;
            this.droppedGuns++;

            this.weight -= OregonH.firePowerWeight;

            this.ui.notify(`Left ${this.droppedGuns} guns behind`, 'negative');
        };

        while (this.food && this.capacity <= this.weight) {
            this.food--;
            this.droppedFood++;

            this.weight -= OregonH.foodWeight;

            this.ui.notify(`Left ${this.droppedFood} food provisions behind`, 'negative');
        }
    }

    updateDistance() {
        let diff = this.capacity - this.weight;
        let speed = OregonH.slowSpeed + diff/this.capacity * OregonH.fullSpeed;

        this.distance += speed
    }

    consumeFood() {
        this.food -= this.crew * OregonH.foodPerPerson;

        if (this.food < 0) {
            this.food = 0
        }
    }
}
