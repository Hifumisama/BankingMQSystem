import { MQService } from '../services/mq.service';

async function testMQConnection() {
  console.log('Démarrage du test de connexion IBM MQ...');
  
  const mqService = new MQService();
  
  try {
    // 1. Connexion
    console.log('Tentative de connexion...');
    await mqService.initialize();
    console.log('✅ Connexion réussie !');
    
    // 2. Envoi d'un message
    const testMessage = {
      type: 'TEST',
      content: 'Ceci est un message de test',
      timestamp: new Date().toISOString()
    };
    
    console.log('Envoi du message de test...');
    const messageId = await mqService.sendMessage(JSON.stringify(testMessage));
    console.log(`✅ Message envoyé avec l'ID: ${messageId}`);
    
    // 3. Lecture du message
    console.log('Tentative de lecture du message...');
    const receivedMessage = await mqService.receiveMessage();
    
    if (receivedMessage) {
      console.log('✅ Message reçu:');
      console.log(JSON.parse(receivedMessage));
    } else {
      console.log('❌ Aucun message reçu dans le délai imparti');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    // 4. Déconnexion
    if (mqService.isConnected()) {
      console.log('Déconnexion...');
      await mqService.disconnect();
      console.log('✅ Déconnexion réussie');
    }
  }
}

// Exécution du test
testMQConnection()
  .then(() => console.log('Test terminé'))
  .catch(error => console.error('Erreur fatale:', error)); 