module.exports = (req, res, next) => {
    res.locals.user = req.session.user;

    if ((req.path !== '/login' || req.path !== '/register') && req.session.user) {
        console.log('1');
        res.redirect('/');
    }

    if (req.path !== '/login' || req.path !== '/register') {
        console.log('2');
        return next()
    }

    if (!req.session.user) {
        console.log('3');
        res.redirect('/');
    }
     next()
}

