import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IMessage {
  id: string;
  content: string;
  partnerId: string;
  timestamp: Date;
  status: 'PENDING' | 'PROCESSED' | 'ERROR';
  mqMessageId?: string; // ID du message dans IBM MQ
}

const messageSchema = new mongoose.Schema<IMessage>({
  id: { type: String, default: uuidv4, unique: true },
  content: { type: String, required: true },
  partnerId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { 
    type: String, 
    required: true,
    enum: ['PENDING', 'PROCESSED', 'ERROR'],
    default: 'PENDING'
  },
  mqMessageId: { type: String, required: false }
});

export const Message = mongoose.model<IMessage>('Message', messageSchema); 