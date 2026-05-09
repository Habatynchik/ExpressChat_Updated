const express = require('express');
const messageService = require("../services/messageService");
const chatService = require("../services/chatService");
const router = express.Router();

router.get("/:chatId/all", async (req, res) => {
    const chatId = req.params.chatId;
    
    if (!chatId) {
        return res.status(400).json({error: "Chat not found"});
    }

    try {
        const messages = await messageService.getAllByChatId(chatId);
        res.status(200).json(messages);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.delete("/:chatId", async (req, res) => {
    const chatId = req.params.chatId;

    if (!chatId) {
        return res.status(400).json({ error: "Chat not found" });
    }

    try {
        const deletedCount = await messageService.deleteAllByChatId(chatId);
        res.status(200).json({ deleted: deletedCount });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post("/:chatId/add", async (req, res) => {
    const chatId = req.params?.chatId
    const users = req.body?.users;

    if ( !users || !chatId) {
        res.status(400).json({error: "Incorrect data"});
    }

    try {
        chatService.addMembers(chatId, users);
        res.status(200).json();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

router.post("/:chatId", async (req, res) => {
    const userId = req.session?.user?.id
    const chatId = req.params.chatId
    const message = req.body.message;

    if (!message || !chatId || !userId) {
        res.status(400).json({error: "Incorrect data"});
    }

    try {
        const newMessage = await messageService.createMessage(chatId, message, userId);
        res.status(200).json(newMessage);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

module.exports = router;