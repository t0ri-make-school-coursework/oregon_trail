const eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -3,
    text: 'Food intoxication. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -4,
    text: 'Flu outbreak. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Worm infestation. Food lost: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -25,
    text: 'Pick pockets steal $'
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'oxen',
    value: -1,
    text: 'Ox flu outbreak. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Found wild berries. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Found wild berries. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'oxen',
    value: 1,
    text: 'Found wild oxen. New oxen: '
  },
  {
      type: 'STAT-CHANGE',
      notification: 'positive',
      stat: 'money',
      value: 20,
      text: 'Found coins in an abandoned wagon. Money added: $'
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'food', qty: 20, price: 50},
      {item: 'oxen', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 50},
      {item: 'crew', qty: 5, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'food', qty: 30, price: 50},
      {item: 'oxen', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 20},
      {item: 'crew', qty: 10, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Smugglers sell various goods',
    products: [
      {item: 'food', qty: 20, price: 60},
      {item: 'oxen', qty: 1, price: 300},
      {item: 'firepower', qty: 2, price: 80},
      {item: 'crew', qty: 5, price: 60}
    ]
  },
  {
      type: 'SHOP',
      notification: 'neutral',
      text: 'You\'ve stumbled upon a town',
        products: [
            {item: 'food', qty: 100, price: 50},
            {item: 'oxen', qty: 1, price: 150},
            {item: 'firepower', qty: 2, price: 40},
            {item: 'crew', qty: 1, price: 25}
        ]
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Bandits are attacking you'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Bandits are attacking you'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Bandits are attacking you'
  },
  {
      type: 'ATTACK',
      notification: 'negative',
      text: 'A rogue cowboy fires a shot in your direction'
  }
];

class Event {
    constructor(game) {
        this.game = game;
        this.eventTypes = eventTypes;
    }

    generateEvent() {
        let eventIndex = Math.floor(Math.random() * this.eventTypes.length);
        let eventData = this.eventTypes[eventIndex];

        //events that consist in updating a stat
        if(eventData.type == 'STAT-CHANGE') {
          this.stateChangeEvent(eventData);
        }

        //shops
        else if(eventData.type == 'SHOP') {
          //pause game
          this.game.pauseJourney();

          //notify user
          this.game.ui.notify(eventData.text, eventData.notification);

          //prepare event
          this.shopEvent(eventData);
        }

        //attacks
        else if(eventData.type == 'ATTACK') {
          //pause game
          this.game.pauseJourney();

          //notify user
          this.game.ui.notify(eventData.text, eventData.notification);

          //prepare event
          this.attackEvent(eventTypes);
        }
    }

    stateChangeEvent(eventData) {
      //can't have negative quantities
      if(eventData.value + this.game.caravan[eventData.stat] >= 0) {
        this.game.caravan[eventData.stat] += eventData.value;
        this.game.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
      }
    };

    shopEvent(eventData) {
      //number of products for sale
      let numProds = Math.ceil(Math.random() * 4);

      //product list
      let products = [];
      let j, priceFactor;

      for(var i = 0; i < numProds; i++) {
        //random product
        j = Math.floor(Math.random() * eventData.products.length);

        //multiply price by random factor +-30%
        priceFactor = 0.7 + 0.6 * Math.random();

        products.push({
          item: eventData.products[j].item,
          qty: eventData.products[j].qty,
          price: Math.round(eventData.products[j].price * priceFactor)
        });
      }

      this.game.ui.showShop(products);
    };


    attackEvent(eventData) {
      let firepower = Math.round((0.7 + 0.6 * Math.random()) * this.game.enemyFirePowerAvg);
      let gold = Math.round((0.7 + 0.6 * Math.random()) * this.game.enemyGoldAvg);

      this.game.ui.showAttack(firepower, gold);
    };
};
