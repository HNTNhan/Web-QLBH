var express = require('express');
var productRepo = require('../repos/productRepo'),
    cartRepo = require('../repos/cartRepo');

var router = express.Router();

router.get('/', (req, res) => {
    var total = 0;
    for(var i = 0; i < req.session.cart.length; i++){
        total += +req.session.cart[i].product.Price * req.session.cart[i].quantity;
    }
    if(req.session.cart.length > 0){
        btbought = true;
    }
    else {
        btbought = false;
    }
    var vm = {
        successMsg : false,
        items: req.session.cart,
        total: total,
        btbought: btbought,
    };
    res.render('cart/index', vm);
});

router.post('/add', (req, res) => {
    productRepo.single(req.body.proId).then(rows => {
        var item = {
            product: rows[0],
            quantity: +req.body.quantity,
            amount: +rows[0].Price * +req.body.quantity,
        };
        cartRepo.add(req.session.cart, item);
        res.redirect(req.headers.referer);
    });
});

router.post('/remove', (req, res) => {
    cartRepo.remove(req.session.cart, +req.body.proId);
    res.redirect(req.headers.referer);
});


router.get('/buy', (req, res) => {
    for(var i =0; i < req.session.cart.length; i++){
        cartRepo.addBought(req.session.cart[i], req.session.curUser.ID).then(rows => {
        });
        cartRepo.subQuantity(req.session.cart[i].product.ProID, req.session.cart[i].quantity)
    }
    req.session.cart = [];
    var vm = {
        successMsg: true,
        total: 0,
        btbought: false
    };
    res.render('cart/index', vm);
});


module.exports = router;