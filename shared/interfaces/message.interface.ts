export interface IMessage {
  id: string;
  content: string;
  partnerId: string;
  timestamp: Date;
  status: 'PENDING' | 'PROCESSED' | 'ERROR';
  mqMessageId?: string; // ID du message dans IBM MQ
} 