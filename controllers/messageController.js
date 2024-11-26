const Message = require('../models/Message');
const User = require('../models/User');

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;

    const senderUser = await User.findById(sender);
    const recipientUser = await User.findById(recipient);

    if (!senderUser || !recipientUser) {
      return res.status(404).json({ message: 'Sender or recipient not found' });
    }

    const newMessage = new Message({
      sender,
      recipient,
      content,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// Get messages for a user
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
      .populate('sender')
      .populate('recipient');

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve messages', error: error.message });
  }
};

// Mark a message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.read = true;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to mark message as read', error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
};