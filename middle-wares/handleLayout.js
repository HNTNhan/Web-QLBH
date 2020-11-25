var categoryRepo = require('../repos/categoryRepo');
    cartRepo = require('../repos/cartRepo');
    
module.exports = (req, res, next) => {

    if (req.session.isLogged === undefined) {
    	req.session.isLogged = false;
    }
    if (req.session.admin === undefined) {
        req.session.admin = false;
    }

    var temp;

    categoryRepo.loadAllF().then(rows =>{
        temp = rows;
    });

    setTimeout(function(){
        categoryRepo.loadAll().then(rows => {
            res.locals.layoutVM = {
                categories: rows,
                categoriesF: temp,
                isLogged: req.session.isLogged,
                curUser: req.session.curUser,
                isAdmin: req.session.admin,
                cartSummary: cartRepo.getNumberOfItems(req.session.cart)
            };
            next();
        });    
    },10)
};