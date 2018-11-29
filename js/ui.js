class UI {
    constructor(game) {
        this.game = game;
    }

    notify(message, type) {
        document.getElementById('updates-area').innerHTML = `<div class="update-${type}">Day ${Math.ceil(this.game.caravan.day)}: ${message} </div>` + document.getElementById('updates-area').innerHTML;
    }

    refreshStats() {
        //modify the dom
        document.getElementById('stat-day').innerHTML = Math.ceil(this.game.caravan.day);
        document.getElementById('stat-distance').innerHTML = Math.floor(this.game.caravan.distance);
        document.getElementById('stat-crew').innerHTML = this.game.caravan.crew;
        document.getElementById('stat-oxen').innerHTML = this.game.caravan.oxen;
        document.getElementById('stat-food').innerHTML = Math.ceil(this.game.caravan.food);
        document.getElementById('stat-money').innerHTML = this.game.caravan.money;
        document.getElementById('stat-firepower').innerHTML = this.game.caravan.firepower;
        document.getElementById('stat-weight').innerHTML = `${Math.ceil(this.game.caravan.weight)} / ${this.game.caravan.capacity}`;

        //update caravan position
        document.getElementById('caravan').style.left = `${(380 * game.caravan.distance / game.finalDistance)}px`;
    }


      buyProduct(product) {
        //check we can afford it
        if (product.price > game.caravan.money) {
          this.notify('Not enough money', 'negative');
          return false;
        }

        this.game.caravan.money -= product.price;

        this.game.caravan[product.item] += +product.qty;

        this.notify(`Bought ${product.qty}x ${product.item}`, 'positive');

        //update weight
        this.game.caravan.updateWeight();

        //update visuals
        this.refreshStats();
      };


      showShop(products) {
          //get shop area
          let shopDiv = document.getElementById('shop');
          shopDiv.classList.remove('hidden');

          //init the shop just once
          if(!this.shopInitiated) {

            //event delegation
            shopDiv.addEventListener('click', function(e){
              //what was clicked
              let target = e.target || e.src;

              //exit button
              if(target.tagName == 'BUTTON') {
                //resume journey
                shopDiv.classList.add('hidden');
                game.resumeJourney();
              }
              else if(target.tagName == 'DIV' && target.className.match(/product/)) {

                game.ui.buyProduct({
                  item: target.getAttribute('data-item'),
                  qty: target.getAttribute('data-qty'),
                  price: target.getAttribute('data-price')
                });

              }
            });

            this.shopInitiated = true;
          }

          //clear existing content
          let prodsDiv = document.getElementById('prods');
          prodsDiv.innerHTML = '';

          //show products
          let product;
          for(let i=0; i < products.length; i++) {
            product = products[i];
            prodsDiv.innerHTML +=  `<div class="product" data-qty="${product.qty}" data-item="${product.item}" data-price="${product.price}">
                                        ${product.qty} ${product.item} - $ ${product.price}
                                    </div>`;
          }
        }

        showAttack(firepower, gold) {
          let attackDiv = document.getElementById('attack');
          attackDiv.classList.remove('hidden');

          //keep properties
          this.firepower = firepower;
          this.gold = gold;

          //show firepower
          document.getElementById('attack-description').innerHTML = 'Firepower: ' + firepower;

          //init once
          if(!this.attackInitiated) {

            //fight
            document.getElementById('fight').addEventListener('click', this.fight.bind(this));

            //run away
            document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

            this.attackInitiated = true;
          }
        };

        fight() {
          let firepower = this.firepower;
          let gold = this.gold;

          let damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.game.caravan.firepower));

          //check there are survivors
          if (damage < this.game.caravan.crew) {
            this.game.caravan.crew -= damage;
            this.game.caravan.money += gold;
            this.notify(`${damage} people were killed fighting`, 'negative');
            this.notify(`Found $${gold}`, 'gold');
          }
          else {
            this.game.caravan.crew = 0;
            this.notify('Everybody died in the fight', 'negative');
          }

          //resume journey
          document.getElementById('attack').classList.add('hidden');
          this.game.resumeJourney();
        };

        runaway() {
          var firepower = this.firepower;

          var damage = Math.ceil(Math.max(0, firepower * Math.random()/2));

          //check there are survivors
          if(damage < this.game.caravan.crew) {
            this.game.caravan.crew -= damage;
            this.notify(`${damage} people were killed running`, 'negative');
          }
          else {
            this.game.caravan.crew = 0;
            this.notify('Everybody died running away', 'negative');
          }

          //remove event listener
          document.getElementById('runaway').removeEventListener('click', listener);

          //resume journey
          document.getElementById('attack').classList.add('hidden');
          this.game.resumeJourney();

        };
}
