import { Message } from '../models/message.model';
import { MQService } from './mq.service';
import { IMessage } from '@shared/interfaces/message.interface';

export class MessageService {
  private mqService: MQService;

  constructor() {
    this.mqService = new MQService();
  }

  /**
   * Initialise le service et la connexion MQ
   */
  public async initialize(): Promise<void> {
    await this.mqService.initialize();
  }

  /**
   * Envoie un message via MQ et le stocke dans MongoDB
   * @param content Contenu du message
   * @param partnerId Identifiant du partenaire
   * @returns Le message créé
   */
  public async sendMessage(content: string, partnerId: string): Promise<IMessage> {
    try {
      // Créer le message dans MongoDB
      const message = new Message({
        content,
        partnerId,
        status: 'PENDING'
      });

      // Envoyer le message via MQ et récupérer son ID
      const mqMessageId = await this.mqService.sendMessage(content);
      
      // Mettre à jour le message avec l'ID MQ et le statut
      message.status = 'PROCESSED';
      message.mqMessageId = mqMessageId; // Stocker l'ID MQ pour le tracer
      await message.save();

      return message;
    } catch (error) {
      // En cas d'erreur, créer le message avec le statut ERROR
      const message = new Message({
        content,
        partnerId,
        status: 'ERROR'
      });
      await message.save();
      throw error;
    }
  }

  /**
   * Reçoit un message de MQ et le stocke dans MongoDB
   * @returns Le message reçu ou null si aucun message n'est disponible
   */
  public async receiveMessage(): Promise<IMessage | null> {
    try {
      // Recevoir le message de MQ
      const content = await this.mqService.receiveMessage();
      
      if (!content) {
        return null;
      }

      // Créer le message dans MongoDB
      const message = new Message({
        content,
        partnerId: 'SYSTEM', // À adapter selon votre logique métier
        status: 'PROCESSED'
      });

      await message.save();
      return message;
    } catch (error) {
      console.error('Error receiving message:', error);
      throw error;
    }
  }

  /**
   * Récupère tous les messages d'un partenaire et les trie par date de création
   * @param partnerId Identifiant du partenaire
   * @returns Liste des messages
   */
  public async getMessagesByPartner(partnerId: string): Promise<IMessage[]> {
    return Message.find({ partnerId }).sort({ timestamp: -1 });
  }

  /**
   * Récupère un message par son ID
   * @param id Identifiant du message
   * @returns Le message ou null
   */
  public async getMessageById(id: string): Promise<IMessage | null> {
    return Message.findOne({ id });
  }
} 