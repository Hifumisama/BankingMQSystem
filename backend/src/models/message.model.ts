import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IMessage } from '@shared/interfaces/message.interface';

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