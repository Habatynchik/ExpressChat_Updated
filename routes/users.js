const express = require('express');
const userService = require("../services/userService");
const router = express.Router();

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', async function (req, res, next) {
    let username = req.body.username
    let password = req.body.password

    userService.authenticate(username, password)
        .then(result => {
            req.session.user = result;
            res.redirect("/chat")
        })
        .catch(err => res.status(401).send(err));
})

router.post('/register', async function (req, res, next) {
    let username = req.body.username
    let password = req.body.password
    let passwordSecond = req.body.passwordSecond

    if (password != passwordSecond) {
        res.status(400).send("password not match");
    }

    userService.create({username, password})
        .then(result => {
            req.session.user = result;
            res.redirect("/chat")
        })
        .catch(err => res.status(400).send(err.message));
})

module.exports = router;
