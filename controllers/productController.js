var express = require('express');
var productRepo = require('../repos/productRepo');
var config = require('../config/config');
var admincheck = require('../middle-wares/admincheck');
var router = express.Router();
var moment = require('moment');
// router.get('/byCat', (req, res) => {
//     var catId = req.query.catId;
//     productRepo.loadAllByCat(catId).then(rows => {
//         var vm = {
//             products: rows
//         };
//         res.render('product/byCat', vm);
//     });
// });

// router.get('/byCat/:catId', (req, res) => {
//     var catId = req.params.catId;
//     productRepo.loadAllByCat(catId).then(rows => {
//         var vm = {
//             products: rows,
//             noProducts: rows.length === 0
//         };
//         res.render('product/byCat', vm);
//     });
// });

router.get('/byPrice/:catId', (req, res) => {
    var catId = req.params.catId;

    var page = req.query.page;
    if (!page) {page = 1;}
    if (page < 1) page = 1;

    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;

    var p1;
    var p2;
    if(catId == 1){
        p1 = productRepo.loadPageByPrice(0, 300000000, offset);
        p2 = productRepo.countByPrice(0, 300000000);
    }
    else if(catId == 2){
        p1 = productRepo.loadPageByPrice(300000000, 1000000000, offset);
        p2 = productRepo.countByPrice(300000000, 1000000000);
    }
    else if(catId == 3) {
        p1 = productRepo.loadPageByPrice(1000000000, 2000000000,offset);
        p2 = productRepo.countByPrice(1000000000, 2000000000);
    }
    else {
        p1 = productRepo.loadPageByPrice(2000000000, 20000000000,offset);
        p2 = productRepo.countByPrice(2000000000, 20000000000);
    }
    Promise.all([p1, p2]).then(([pRows, countRows]) => {

        var total = countRows[0].total;
        var nPages = total / config.PRODUCTS_PER_PAGE;
        if (total % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }
        var temp = [];
        var t = Math.floor(nPages);
        temp.push({
            max: t
        });
        var vm = {
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
            max_page: temp[0]
        };
        res.render('product/byPrice', vm);
    });
});

router.get('/byCatF/:catId', (req, res) => {
    var catId = req.params.catId;

    var page = req.query.page;
    if (!page) {page = 1;}
    if (page < 1) page = 1;

    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;

    var p1 = productRepo.loadPageByCatF(catId, offset);
    var p2 = productRepo.countByCatF(catId);
    Promise.all([p1, p2]).then(([pRows, countRows]) => {

        var total = countRows[0].total;
        var nPages = total / config.PRODUCTS_PER_PAGE;
        if (total % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }
        var temp = [];
        var t = Math.floor(nPages);
        temp.push({
            max: t
        });
        var vm = {
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
            max_page: temp[0]
        };
        res.render('product/byCatF', vm);
    });
});

router.get('/byCat/:catId', (req, res) => {
    var catId = req.params.catId;

    var page = req.query.page;
    if (!page) {page = 1;}
    if (page < 1) page = 1;

    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;

    var p1 = productRepo.loadPageByCat(catId, offset);
    var p2 = productRepo.countByCat(catId);
    Promise.all([p1, p2]).then(([pRows, countRows]) => {

        var total = countRows[0].total;
        var nPages = total / config.PRODUCTS_PER_PAGE;
        if (total % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }
        var temp = [];
        var t = Math.floor(nPages);
        temp.push({
            max: t
        });
        var vm = {
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
            max_page: temp[0]
        };

        res.render('product/byCat', vm);
    });
});

router.get('/detail/:proId', (req, res) => {
    var proId = req.params.proId;
    productRepo.single(proId).then(rows => {
        if (rows.length > 0) {
            var vm = {
                product: rows[0]
            };
            res.render('product/detail', vm);
        } else {
            res.end('NO PRODUCT');
        }
    });
});

router.get('/', admincheck, (req, res) => {
    productRepo.loadAll().then(rows => {
        for(var i =0; i < rows.length; i++){
            rows[i].Arrive =  moment(rows[i].Arrive, 'YYYY-MM-DDTHH:mm')
        .format('D/M/YYYY');
        }
        var vm = {
            layout: 'admin.handlebars',
            products: rows
        };
        res.render('product/index', vm);
    });
});

router.get('/add', admincheck, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        showAlert: false
    };
    res.render('product/add', vm);
});

router.post('/add', (req, res) => {
    req.body.Arrive = moment(req.body.Arrive, 'D/M/YYYY')
        .format('YYYY-MM-DDTHH:mm');
    productRepo.add(req.body).then(value => {
        var vm = {
            layout: 'admin.handlebars',
            showAlert: true
        }
        res.render('product/add', vm);
    });
});

router.get('/delete', admincheck, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        ProID: +req.query.id
    };
    res.render('product/delete', vm);
});

router.post('/delete', (req, res) => {
    productRepo.delete(req.body.ProID).then(value => {
        res.redirect('/product');
    });
});

router.get('/edit', admincheck, (req, res) => {
    productRepo.single(req.query.id).then(rows => {
        rows[0].Arrive =  moment(rows[0].Arrive, 'YYYY-MM-DDTHH:mm')
        .format('D/M/YYYY');
        var vm = {
            layout: 'admin.handlebars',
            Product: rows[0]
        };
        res.render('product/edit', vm);
    });
});

router.post('/edit', (req, res) => {
    req.body.Arrive =  moment(req.body.Arrive, 'D/M/YYYY')
        .format('YYYY-MM-DDTHH:mm');
    productRepo.update(req.body).then(value => {
        res.redirect('/product');
    });
});

var pn;
router.post('/search', (req, res) => {
    var proName = req.body.proName;
    pn = proName;

    var page = req.query.page;
    if (!page) {page = 1;}
    if (page < 1) page = 1;


    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;

    var p1 = productRepo.loadPageBySearch(proName, offset);
    var p2 = productRepo.countBySearch(proName);
    Promise.all([p1, p2]).then(([pRows, countRows]) => {

        var total = countRows[0].total;
        var nPages = total / config.PRODUCTS_PER_PAGE;
        if (total % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }
        var temp = [];
        var t = Math.floor(nPages);
        temp.push({
            max: t
        });

        var vm = {
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
            max_page: temp[0]
        };

        res.render('product/search', vm);
    });
});

router.get('/search', (req, res) => {
    var proName = pn;

    var page = req.query.page;
    if (!page) {page = 1;}
    if (page < 1) page = 1;


    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;

    var p1 = productRepo.loadPageBySearch(proName, offset);
    var p2 = productRepo.countBySearch(proName);
    Promise.all([p1, p2]).then(([pRows, countRows]) => {

        var total = countRows[0].total;
        var nPages = total / config.PRODUCTS_PER_PAGE;
        if (total % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }
        var temp = [];
        var t = Math.floor(nPages);
        temp.push({
            max: t
        });

        var vm = {
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
            max_page: temp[0]
        };

        res.render('product/search', vm);
    });
});

module.exports = router;