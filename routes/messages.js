const express = require('express');
const messageService = require("../services/messageService");
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

router.post("/:chatId", async (req, res) => {
    const userId = req.session?.user?.id
    const chatId = req.params.chatId
    const message = req.body.message;

    if (!message || !chatId || !userId) {
        res.status(400).json({error: "Incorrect data"});
    }

    try {
        const message = await messageService.createMessage(chatId, message, userId);
        res.status(200).json(message);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

module.exports = router;