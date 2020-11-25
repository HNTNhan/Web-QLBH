var express = require('express');
var userRepo = require('../repos/userRepo');
var config = require('../config/config');
var admincheck = require('../middle-wares/admincheck');
var router = express.Router();
var moment = require('moment');
var sha256 = require('crypto-js/sha256')


router.get('/', admincheck, (req, res) => {
    userRepo.loadAll().then(rows => {
        for(var i =0; i < rows.length; i++){
            rows[i].DOB =  moment(rows[i].DOB, 'YYYY-MM-DDTHH:mm')
        .format('D/M/YYYY');
        }
        var vm = {
            layout: 'admin.handlebars',
            users: rows
        };
        res.render('user/index', vm);
    });
});

router.get('/delete', admincheck, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        ID: +req.query.id
    };
    res.render('user/delete', vm);
});

router.post('/delete', (req, res) => {
    userRepo.delete(req.body.ID).then(value => {
        res.redirect('/user');
    });
});

router.get('/edit', admincheck, (req, res) => {
    userRepo.single(req.query.id).then(rows => {
        rows[0].DOB =  moment(rows[0].DOB, 'YYYY-MM-DDTHH:mm')
        .format('D/M/YYYY');
        var vm = {
            layout: 'admin.handlebars',
            User: rows[0]
        };
        res.render('user/edit', vm);
    });
});

router.post('/edit', (req, res) => {
    req.body.DOB =  moment(req.body.DOB, 'D/M/YYYY')
        .format('YYYY-MM-DDTHH:mm');
    userRepo.single(req.query.id).then(rows => {
    	if(req.body.Password.toString() != rows[0].Password.toString() ){
    		req.body.Password = sha256(req.body.Password).toString();
    		userRepo.update(req.body).then(value => {
	       		res.redirect('/user');
	   		});
    	}
    	else{
    		userRepo.update(req.body).then(value => {
		        res.redirect('/user');
		    });
    	}
    });
});

module.exports = router;