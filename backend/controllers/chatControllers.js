const chatModel = require("../models/Chat");

const getConversations = async (req, res) => {
  try {
    const conversations = await chatModel.getUserConversations(req.userId);
    res.json(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMessagesByConversation = async (req, res) => {
  try {
    const messages = await chatModel.getMessages(req.params.conversationId);
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendMessageRest = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content)
      return res.status(400).json({ message: "Missing data" });

    const conv = await chatModel.findOrCreateConversation(req.userId, receiverId);
    const message = await chatModel.sendMessage(conv.id, req.userId, content);
    console.log("Conversation:", conv);


    res.status(201).json(message);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getConversations,
  getMessagesByConversation,
  sendMessageRest,
};
