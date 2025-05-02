import { Partner } from '../models/partner.model';
import { IPartner } from '@shared/interfaces/partner.interface';

export class PartnerService {
  /**
   * Crée un nouveau partenaire
   * @param partner Données du partenaire
   * @returns Le partenaire créé
   */
  public async createPartner(partner: Omit<IPartner, 'id'>): Promise<IPartner> {
    const newPartner = new Partner(partner);
    return newPartner.save();
  }

  /**
   * Récupère tous les partenaires
   * @returns Liste des partenaires
   */
  public async getAllPartners(): Promise<IPartner[]> {
    return Partner.find();
  }

  /**
   * Récupère un partenaire par son ID
   * @param id Identifiant du partenaire
   * @returns Le partenaire ou null
   */
  public async getPartnerById(id: string): Promise<IPartner | null> {
    return Partner.findOne({ id });
  }

  /**
   * Supprime un partenaire
   * @param id Identifiant du partenaire
   * @returns true si supprimé, false sinon
   */
  public async deletePartner(id: string): Promise<boolean> {
    const result = await Partner.deleteOne({ id });
    return result.deletedCount === 1;
  }
} 