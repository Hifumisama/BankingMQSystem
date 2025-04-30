import express from 'express';
import { Message } from '../models/message.model';
import { MessageService } from '../services/message.service';

const router = express.Router();
const messageService = new MessageService();

// Initialiser le service au démarrage
messageService.initialize().catch(error => {
  console.error('Failed to initialize message service:', error);
});

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
    const message = await messageService.getMessageById(req.params.id);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching message', error });
  }
});

// Send a message
router.post('/send', async (req, res) => {
  try {
    const { content, partnerId } = req.body;
    
    if (!content || !partnerId) {
      res.status(400).json({ message: 'Content and partnerId are required' });
      return;
    }

    const message = await messageService.sendMessage(content, partnerId);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
});

// Receive a message
router.get('/receive', async (req, res) => {
  try {
    const message = await messageService.receiveMessage();
    if (!message) {
      res.status(204).json({ message: 'No message available' });
      return;
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error receiving message', error });
  }
});

// Get messages by partner
// Cette route permet de récupérer tous les messages associés à un partenaire spécifique
// Utile pour l'historique des échanges avec un partenaire
router.get('/partner/:partnerId', async (req, res) => {
  try {
    const messages = await messageService.getMessagesByPartner(req.params.partnerId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

export default router; 