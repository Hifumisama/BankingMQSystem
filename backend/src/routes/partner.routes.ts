import express, { Request, Response, Router } from 'express';
import { Partner } from '../models/partner.model';

const router: Router = express.Router();


// Get all partners
// Cette route permet de récupérer la liste complète des partenaires
// Utile pour l'affichage dans l'interface utilisateur
router.get('/', async (req, res) => {
  try {
    const partners = await Partner.find();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching partners', error });
  }
});

// Get partner by id
router.get('/:id', async (req, res) => {
  try {
    const partner = await Partner.findOne({ id: req.params.id });
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
    const partner = new Partner(req.body);
    const savedPartner = await partner.save();
    res.status(201).json(savedPartner);
  } catch (error) {
    res.status(400).json({ message: 'Error creating partner', error });
  }
});

// Update partner
router.put('/:id', async (req, res) => {
  try {
    const partner = await Partner.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!partner) {
      res.status(404).json({ message: 'Partner not found' });
      return;
    }
    res.json(partner);
  } catch (error) {
    res.status(400).json({ message: 'Error updating partner', error });
  }
});

// Delete partner
router.delete('/:id', async (req, res) => {
  try {
    const partner = await Partner.findOneAndDelete({ id: req.params.id });
    if (!partner) {
      res.status(404).json({ message: 'Partner not found' });
      return;
    }
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting partner', error });
  }
});

export default router; 