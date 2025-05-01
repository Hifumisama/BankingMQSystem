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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const message_model_1 = require("../models/message.model");
const mq_service_1 = require("./mq.service");
class MessageService {
    constructor() {
        this.mqService = new mq_service_1.MQService();
    }
    /**
     * Initialise le service et la connexion MQ
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mqService.initialize();
        });
    }
    /**
     * Envoie un message via MQ et le stocke dans MongoDB
     * @param content Contenu du message
     * @param partnerId Identifiant du partenaire
     * @returns Le message créé
     */
    sendMessage(content, partnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Créer le message dans MongoDB
                const message = new message_model_1.Message({
                    content,
                    partnerId,
                    direction: 'OUTBOUND',
                    status: 'PENDING'
                });
                // Envoyer le message via MQ et récupérer son ID
                const mqMessageId = yield this.mqService.sendMessage(content);
                // Mettre à jour le message avec l'ID MQ et le statut
                message.status = 'PROCESSED';
                message.mqMessageId = mqMessageId; // Stocker l'ID MQ pour le tracer
                yield message.save();
                return message;
            }
            catch (error) {
                // En cas d'erreur, créer le message avec le statut ERROR
                const message = new message_model_1.Message({
                    content,
                    partnerId,
                    direction: 'OUTBOUND',
                    status: 'ERROR'
                });
                yield message.save();
                throw error;
            }
        });
    }
    /**
     * Reçoit un message de MQ et le stocke dans MongoDB
     * @returns Le message reçu ou null si aucun message n'est disponible
     */
    receiveMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Recevoir le message de MQ
                const content = yield this.mqService.receiveMessage();
                if (!content) {
                    return null;
                }
                // Créer le message dans MongoDB
                const message = new message_model_1.Message({
                    content,
                    partnerId: 'SYSTEM', // À adapter selon votre logique métier
                    direction: 'INBOUND',
                    status: 'PROCESSED'
                });
                yield message.save();
                return message;
            }
            catch (error) {
                console.error('Error receiving message:', error);
                throw error;
            }
        });
    }
    /**
     * Récupère tous les messages d'un partenaire et les trie par date de création
     * @param partnerId Identifiant du partenaire
     * @returns Liste des messages
     */
    getMessagesByPartner(partnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return message_model_1.Message.find({ partnerId }).sort({ timestamp: -1 });
        });
    }
    /**
     * Récupère un message par son ID
     * @param id Identifiant du message
     * @returns Le message ou null
     */
    getMessageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return message_model_1.Message.findOne({ id });
        });
    }
}
exports.MessageService = MessageService;
