class UI {
    constructor(game) {
        this.game = game;
    }

    notify() {
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
        document.getElementById('caravan').style.left = `${(380 * this.game.caravan.distance/OregonH.FINAL_DISTANCE)} px`;
    }

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
              this.game.resumeJourney();
            }
            else if(target.tagName == 'DIV' && target.className.match(/product/)) {

              this.buyProduct({
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
          prodsDiv.innerHTML += `<div class="product" data-qty="${product.qty}" data-item="${product.item}" data-price="${product.price}">
                                      ${product.qty} ${product.item} - $ ${product.price}
                                  </div>`;
        }
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
        this.game.refreshStats();
      };

}
