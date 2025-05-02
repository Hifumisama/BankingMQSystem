export interface IPartner {
  id: string;
  alias: string;
  type: string;
  direction: 'INBOUND' | 'OUTBOUND';
  application: string;
  processed_flow_type: 'MESSAGE' | 'ALERTING' | 'NOTIFICATION';
  description: string;
} 