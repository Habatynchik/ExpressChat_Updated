module.exports = (req, res, next) => {
    res.locals.user = req.session.user;

    const isLoggedIn = !!req.session.user;
    const path = req.path;

    const publicPaths = ['/users/login', '/users/register', '/'];

    if (isLoggedIn && publicPaths.includes(path)) {
        return res.redirect('/chat');
    }

    if (!isLoggedIn && !publicPaths.includes(path)) {
        return res.redirect('/');
    }

    next();
}

