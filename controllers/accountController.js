var express = require('express'),
    sha256 = require('crypto-js/sha256'),
    moment = require('moment');

var restrict = require('../middle-wares/restrict');
var accountRepo = require('../repos/accountRepo');
var cartRepo = require('../repos/cartRepo');

var router = express.Router();

router.get('/register', (req, res) => {
    res.render('account/register');
});

router.post('/register', (req, res) => {
    accountRepo.check(req.body.username).then(value => {
        if(value.length > 0){
            var vm = {
                showError: true,
            };
            res.render('account/register', vm);
        }
        else{
            var dob = moment(req.body.dob, 'D/M/YYYY').format('YYYY-MM-DDTHH:mm');

            var user = {
                username: req.body.username,
                password: sha256(req.body.rawPWD).toString(),
                name: req.body.name,
                email: req.body.email,
                dob: dob,
                permisson: 0
            };

            accountRepo.add(user).then(value => {
                res.render('account/login');
            });
        }
    });
});

router.get('/login', (req, res) => {
    res.render('account/login');
});

router.post('/login', (req, res) => {
    var user = {
        username: req.body.username,
        password: sha256(req.body.rawPWD).toString()
    };
    accountRepo.login(user).then(rows => {
        if (rows.length > 0) {
            req.session.isLogged = true;
            req.session.curUser = rows[0];
            req.session.cart = [];
            if(rows[0].Permission === 1){
                req.session.admin = true;
            }
            else req.session.admin = false;
            var url = '/';
            if (req.query.retUrl) {
                url = req.query.retUrl;
            }
            res.redirect(url);
        } else {
            var vm = {
                showError: true,
                errorMsg: 'Login failed'
            };
            res.render('account/login', vm);
        }
    });
});

router.post('/logout', restrict, (req, res) => {
    req.session.isLogged = false;
    req.session.curUser = null;
    req.session.cart = [];
    req.session.admin = false;
    res.redirect(req.headers.referer);
});

router.get('/profile', restrict, (req, res) => {
    var dob = moment(req.session.curUser.DOB, 'YYYY-MM-DDTHH:mm')
        .format('D/M/YYYY');

    var vm = {
        layout: 'profile.handlebars',
        dob: dob
    };
    res.render('account/profile', vm);
});

router.post('/profile', (req, res) => {
    var dob = moment(req.body.dob, 'D/M/YYYY')
        .format('YYYY-MM-DDTHH:mm');

    var user = {
        id : req.session.curUser.ID,
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        dob: dob,
    };

    accountRepo.update(user).then(value => {
    });

    setTimeout(function(){
        accountRepo.single(req.session.curUser.ID).then(row => {
            req.session.curUser = row[0];
            var vm = {
                layout: 'profile.handlebars',
                successMsg: 'Thông tin tài khoản đã được cập nhật'
            };
            res.render('account/success', vm);    
        });  
    }, 500);
});

router.get('/success', restrict, (req, res) => {
    var vm = {
        layout: 'profile.handlebars',    
    };
    res.render('account/success', vm);
});

router.get('/changePass', restrict, (req, res) => {
    var vm = {
        layout: 'profile.handlebars',
    };
    res.render('account/changePass', vm);
});

router.post('/changePass', (req, res) => {
    if(sha256(req.body.oldPWD).toString() != req.session.curUser.Password)
    {
        var vm = {
                layout: 'profile.handlebars',
                showError: true,
                errorMsg: 'Password cũ không chính xác!'
            };
            res.render('account/changePass', vm);   
    }
    else if(req.body.rawPWD != req.body.againPWD){
        var vm = {
                layout: 'profile.handlebars',
                showError: true,
                errorMsg: 'Vui lòng nhập lại đúng Password mới!'
            };
            res.render('account/changePass', vm);   
    }
    else {
        var user = {
        id : req.session.curUser.ID,
        password: sha256(req.body.rawPWD).toString(),
    };

    accountRepo.updatePass(user).then(value => {
    });

    setTimeout(function(){
        accountRepo.single(req.session.curUser.ID).then(row => {
            req.session.curUser = row[0];
            var vm = {
                layout: 'profile.handlebars',
                successMsg: 'Thay đổi mật khẩu thành công'
            };
            res.render('account/success', vm);    
        });  
    }, 500);
    }
});


router.get('/message', restrict, (req, res) => {
    accountRepo.loadAllMsg().then(rows => {
        if(rows.length > 0){
            var vm = {
                layout: 'profile.handlebars',
                messages: rows,
            };
            res.render('account/message', vm);
        }
        else {
            var vm = {
                layout: 'profile.handlebars',
                NoMessage: true,
            };
            res.render('account/message', vm);
        }
    });
});

router.get('/historyitem', restrict, (req, res) => {
    cartRepo.loadAllBought(req.session.curUser.ID).then(rows => {
        if(rows.length > 0){
            for(var i = 0; i < rows.length; i++){
                rows[i].DateBuy = moment(rows[i].DateBuy, 'YYYY-MM-DDTHH:mm')
        .format('DD/MM/YYYY');
            }
            var vm = {
                layout: 'profile.handlebars',
                items: rows,
                NoMessage: false,
            };
            res.render('account/historyitem', vm);
        }
        else {
            var vm = {
                layout: 'profile.handlebars',
                NoMessage: true,
            };
            res.render('account/historyitem', vm);
        }
    });
});

module.exports = router;