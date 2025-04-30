import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IPartner {
  id: string;
  alias: string;
  type: string;
  direction: 'INBOUND' | 'OUTBOUND';
  application: string;
  processed_flow_type: 'MESSAGE' | 'ALERTING' | 'NOTIFICATION';
  description: string;
}

const partnerSchema = new mongoose.Schema<IPartner>({
  id: { type: String, default: uuidv4, unique: true },
  alias: { type: String, required: true },
  type: { type: String, required: true },
  direction: { 
    type: String, 
    required: true,
    enum: ['INBOUND', 'OUTBOUND']
  },
  application: { type: String, required: true },
  processed_flow_type: { 
    type: String, 
    required: true,
    enum: ['MESSAGE', 'ALERTING', 'NOTIFICATION']
  },
  description: { type: String, required: true }
});

export const Partner = mongoose.model<IPartner>('Partner', partnerSchema); 