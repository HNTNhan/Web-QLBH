var express = require('express');
var homeRepo = require('../repos/homeRepo')

var router = express.Router();

router.get('/', (req, res, next) => {	

    var temp1 = [];
    var t1;
    var products1= [];
    var product1;
    var rows1 = [];

    var temp2 = [];
    var t2;
    var products2= [];
    var product2;
    var rows2 = [];
    
    var temp3 = [];
    var t3;
    var products3= [];
    var product3;
    var rows3 = [];


	homeRepo.loadArrive().then(rows1 => {
		for(i=1; i<rows1.length; i++){
            	temp1[i-1] = rows1[i];
        }
        t1 = rows1[0];
        homeRepo.loadSold().then(rows2 => {
            for(i=1; i<rows2.length; i++){
                    temp2[i-1] = rows2[i];
            }
            t2 = rows2[0];
            homeRepo.loadViewed().then(rows3 => {
                for(i=1; i<rows3.length; i++){
                        temp3[i-1] = rows3[i];
                }
                t3 = rows3[0];
                var vm = {  
                    products1: temp1,
                    product1: t1,
                    products2: temp2,
                    product2: t2,
                    products3: temp3,
                    product3: t3
                };
                res.render('home/index', vm);
            });
        });    
    });
})

router.get('/about', (req, res) => {
    res.render('home/about');
});

module.exports = router;