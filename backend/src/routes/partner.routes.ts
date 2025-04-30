import express from 'express';
import { PartnerService } from '../services/partner.service';

const router = express.Router();
const partnerService = new PartnerService();

// Get all partners
// Cette route permet de récupérer la liste complète des partenaires
// Utile pour l'affichage dans l'interface utilisateur
router.get('/', async (req, res) => {
  try {
    const partners = await partnerService.getAllPartners();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching partners', error });
  }
});

// Get partner by id
router.get('/:id', async (req, res) => {
  try {
    const partner = await partnerService.getPartnerById(req.params.id);
    if (!partner) {
      res.status(404).json({ message: 'Partner not found' });
      return;
    }
    res.json(partner);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching partner', error });
  }
});

// Create partner
router.post('/', async (req, res) => {
  try {
    const partner = await partnerService.createPartner(req.body);
    res.status(201).json(partner);
  } catch (error) {
    res.status(400).json({ message: 'Error creating partner', error });
  }
});


// Delete partner
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await partnerService.deletePartner(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Partner not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting partner', error });
  }
});

export default router; 