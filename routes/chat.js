const express = require('express');
const chatService = require("../services/chatService");
const router = express.Router();


// create chat
router.post("/", async (req, res) => {

    const name = req.body.name
    const imageUrl = req.body.imageUrl
    const userId = req.session.user.id;

    if (!name || !imageUrl || !userId) {
        res.status(400).send({})
    }

    chatService.create(name, imageUrl, userId)
        .then(result => {res.status(200).json(result)})
        .catch(err => res.status(500).send(err))
})

//get all chats
router.get("/all", async (req, res) => {
    let userId = req.session.user.id

    chatService.getAllByUserId(userId)
        .then(result => {res.status(200).json(result)})
        .catch(err => res.status(500).send(err))
})

// get chat by id
router.get("/:id", (req, res) => {
})

// update chat
router.put("/:id", (req, res) => {
})


module.exports = router;