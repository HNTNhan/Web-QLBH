module.exports = (req, res, next) => {
    if (req.session.isLogged === false) {
        res.redirect('/account/login?retUrl=' + req.originalUrl);
    } 
    else if(req.session.admin === false) {
        res.statusCode = 404;
    	res.render('error/index');
    }
    else{
    	next();
    }
}