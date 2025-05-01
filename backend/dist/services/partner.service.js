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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerService = void 0;
const partner_model_1 = require("../models/partner.model");
class PartnerService {
    /**
     * Crée un nouveau partenaire
     * @param partner Données du partenaire
     * @returns Le partenaire créé
     */
    createPartner(partner) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPartner = new partner_model_1.Partner(partner);
            return newPartner.save();
        });
    }
    /**
     * Récupère tous les partenaires
     * @returns Liste des partenaires
     */
    getAllPartners() {
        return __awaiter(this, void 0, void 0, function* () {
            return partner_model_1.Partner.find();
        });
    }
    /**
     * Récupère un partenaire par son ID
     * @param id Identifiant du partenaire
     * @returns Le partenaire ou null
     */
    getPartnerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return partner_model_1.Partner.findOne({ id });
        });
    }
    /**
     * Supprime un partenaire
     * @param id Identifiant du partenaire
     * @returns true si supprimé, false sinon
     */
    deletePartner(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield partner_model_1.Partner.deleteOne({ id });
            return result.deletedCount === 1;
        });
    }
}
exports.PartnerService = PartnerService;
