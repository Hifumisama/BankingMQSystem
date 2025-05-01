"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const partner_service_1 = require("../services/partner.service");
const router = express_1.default.Router();
const partnerService = new partner_service_1.PartnerService();
// Get all partners
// Cette route permet de récupérer la liste complète des partenaires
// Utile pour l'affichage dans l'interface utilisateur
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partners = yield partnerService.getAllPartners();
        res.json(partners);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching partners', error });
    }
}));
// Get partner by id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partner = yield partnerService.getPartnerById(req.params.id);
        if (!partner) {
            res.status(404).json({ message: 'Partner not found' });
            return;
        }
        res.json(partner);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching partner', error });
    }
}));
// Create partner
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partner = yield partnerService.createPartner(req.body);
        res.status(201).json(partner);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating partner', error });
    }
}));
// Delete partner
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield partnerService.deletePartner(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: 'Partner not found' });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting partner', error });
    }
}));
exports.default = router;
