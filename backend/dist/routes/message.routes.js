"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_model_1 = require("../models/message.model");
const message_service_1 = require("../services/message.service");
const router = express_1.default.Router();
const messageService = new message_service_1.MessageService();
// Initialiser le service au démarrage
messageService.initialize().catch(error => {
    console.error('Failed to initialize message service:', error);
});
// Get all messages
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield message_model_1.Message.find();
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
}));
// Get message by id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield messageService.getMessageById(req.params.id);
        if (!message) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }
        res.json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching message', error });
    }
}));
// Send a message
router.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, partnerId } = req.body;
        if (!content || !partnerId) {
            res.status(400).json({ message: 'Content and partnerId are required' });
            return;
        }
        const message = yield messageService.sendMessage(content, partnerId);
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
}));
// Receive a message
router.get('/receive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield messageService.receiveMessage();
        if (!message) {
            res.status(204).json({ message: 'No message available' });
            return;
        }
        res.json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Error receiving message', error });
    }
}));
// Get messages by partner
// Cette route permet de récupérer tous les messages associés à un partenaire spécifique
// Utile pour l'historique des échanges avec un partenaire
router.get('/partner/:partnerId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield messageService.getMessagesByPartner(req.params.partnerId);
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
}));
exports.default = router;
