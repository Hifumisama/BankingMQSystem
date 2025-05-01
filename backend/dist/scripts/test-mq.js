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
const mq_service_1 = require("../services/mq.service");
function testMQConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Démarrage du test de connexion IBM MQ...');
        const mqService = new mq_service_1.MQService();
        try {
            // 1. Connexion
            console.log('Tentative de connexion...');
            yield mqService.initialize();
            console.log('✅ Connexion réussie !');
            // 2. Envoi d'un message
            const testMessage = {
                type: 'TEST',
                content: 'Ceci est un message de test',
                timestamp: new Date().toISOString()
            };
            console.log('Envoi du message de test...');
            const messageId = yield mqService.sendMessage(JSON.stringify(testMessage));
            console.log(`✅ Message envoyé avec l'ID: ${messageId}`);
            // 3. Lecture du message
            console.log('Tentative de lecture du message...');
            const receivedMessage = yield mqService.receiveMessage();
            if (receivedMessage) {
                console.log('✅ Message reçu:');
                console.log(JSON.parse(receivedMessage));
            }
            else {
                console.log('❌ Aucun message reçu dans le délai imparti');
            }
        }
        catch (error) {
            console.error('❌ Erreur lors du test:', error);
        }
        finally {
            // 4. Déconnexion
            if (mqService.isConnected()) {
                console.log('Déconnexion...');
                yield mqService.disconnect();
                console.log('✅ Déconnexion réussie');
            }
        }
    });
}
// Exécution du test
testMQConnection()
    .then(() => console.log('Test terminé'))
    .catch(error => console.error('Erreur fatale:', error));
