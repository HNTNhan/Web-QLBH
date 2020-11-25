var express = require('express'),
    categoryRepo = require('../repos/categoryRepo');
var admincheck = require('../middle-wares/admincheck');

var router = express.Router();


router.get('/', admincheck, (req, res) => {
    categoryRepo.loadAll().then(rows => {
        var vm = {
            layout: 'admin.handlebars',
            categories: rows
        };
        res.render('category/index', vm);
    });
});

router.get('/add', admincheck, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        showAlert: false
    };
    res.render('category/add', vm);
});

router.post('/add', (req, res) => {
    categoryRepo.add(req.body).then(value => {
        var vm = {
            layout: 'admin.handlebars',
            showAlert: true
        }
        res.render('category/add', vm);
    });
});

router.get('/delete', admincheck, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        CatID: +req.query.id
    };
    res.render('category/delete', vm);
});

router.post('/delete', (req, res) => {
    categoryRepo.delete(req.body.CatID).then(value => {
        res.redirect('/category');
    });
});

router.get('/edit', admincheck, (req, res) => {
    categoryRepo.single(req.query.id).then(rows => {
        var vm = {
            layout: 'admin.handlebars',
            Category: rows[0]
        };
        res.render('category/edit', vm);
    });
});

router.post('/edit', (req, res) => {
    categoryRepo.update(req.body).then(value => {
        res.redirect('/category');
    });
});

module.exports = router;