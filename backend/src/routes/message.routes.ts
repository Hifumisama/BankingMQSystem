import express from 'express';
import { Message } from '../models/message.model';

const router = express.Router();

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

// Get message by id
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findOne({ id: req.params.id });
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching message', error });
  }
});

// Create message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: 'Error creating message', error });
  }
});

// Get messages by partner
// Cette route permet de récupérer tous les messages associés à un partenaire spécifique
// Utile pour l'historique des échanges avec un partenaire
router.get('/partner/:partnerId', async (req, res) => {
  try {
    const messages = await Message.find({ partnerId: req.params.partnerId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

export default router; 