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
exports.MQService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mq = require("ibmmq");
const MQC = mq.MQC; // Want to refer to this export directly for simplicity
dotenv_1.default.config();
class MQService {
    constructor() {
        this.queueManager = null;
        this.queueHandle = null;
        this.ok = true;
        this.config = {
            queueName: 'DEV.QUEUE.1',
            queueManagerName: process.env.MQ_QMGR_NAME || 'QM1',
            connection: {
                host: process.env.MQ_HOST || 'localhost',
                port: process.env.MQ_PORT || '1414',
                channel: process.env.MQ_CHANNEL || 'DEV.APP.SVRCONN'
            },
            credentials: {
                user: process.env.MQ_USER || 'app',
                password: process.env.MQ_PASSWORD || 'passw0rd'
            }
        };
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Création de la structure MQCNO pour les options de connexion
                const cno = new mq.MQCNO();
                // Ajout de l'authentification via MQCSP
                const csp = new mq.MQCSP();
                csp.UserId = this.config.credentials.user;
                csp.Password = this.config.credentials.password;
                cno.SecurityParms = csp;
                // Configuration du mode client
                cno.Options = MQC.MQCNO_CLIENT_BINDING;
                // Configuration de la connexion via MQCD
                const cd = new mq.MQCD();
                cd.ConnectionName = `${this.config.connection.host}(${this.config.connection.port})`;
                cd.ChannelName = this.config.connection.channel;
                cno.ClientConn = cd;
                // Connexion au Queue Manager
                this.queueManager = yield new Promise((resolve, reject) => {
                    mq.Connx(this.config.queueManagerName, cno, (err, hConn) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(hConn);
                        }
                    });
                });
                console.log('Connected to IBM MQ successfully');
            }
            catch (error) {
                console.error('Error connecting to IBM MQ:', error);
                throw error;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.queueManager) {
                try {
                    yield new Promise((resolve, reject) => {
                        mq.Disc(this.queueManager, (err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(null);
                            }
                        });
                    });
                    this.queueManager = null;
                    console.log('Disconnected from IBM MQ');
                }
                catch (error) {
                    console.error('Error disconnecting from IBM MQ:', error);
                    throw error;
                }
            }
        });
    }
    isConnected() {
        return this.queueManager !== null;
    }
    /**
     * Envoie un message dans la file d'attente
     * @param message Le contenu du message à envoyer
     * @returns L'identifiant du message envoyé
     */
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queueManager) {
                throw new Error('Not connected to IBM MQ');
            }
            return new Promise((resolve, reject) => {
                try {
                    // Définir l'objet de la file d'attente
                    const od = new mq.MQOD();
                    od.ObjectName = this.config.queueName;
                    od.ObjectType = MQC.MQOT_Q;
                    // Ouvrir la file en mode OUTPUT
                    mq.Open(this.queueManager, od, MQC.MQOO_OUTPUT, (err, hObj) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        try {
                            // Créer les structures MQMD et MQPMO
                            const mqmd = new mq.MQMD();
                            const pmo = new mq.MQPMO();
                            // Configurer les options de Put
                            pmo.Options = MQC.MQPMO_NO_SYNCPOINT |
                                MQC.MQPMO_NEW_MSG_ID |
                                MQC.MQPMO_NEW_CORREL_ID;
                            // Envoyer le message
                            mq.Put(hObj, mqmd, pmo, message, (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                // Récupérer l'ID du message
                                const messageId = mqmd.MsgId.toString('hex');
                                // Fermer la file
                                mq.Close(hObj, 0, (err) => {
                                    if (err) {
                                        console.error('Error closing queue:', err);
                                    }
                                    resolve(messageId);
                                });
                            });
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
    /**
     * Reçoit un message de la file d'attente
     * @returns Le contenu du message reçu ou null si aucun message n'est disponible
     */
    receiveMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queueManager) {
                throw new Error('Not connected to IBM MQ');
            }
            return new Promise((resolve, reject) => {
                try {
                    // Définir l'objet de la file d'attente
                    const od = new mq.MQOD();
                    od.ObjectName = this.config.queueName;
                    od.ObjectType = MQC.MQOT_Q;
                    // Ouvrir la file en mode INPUT
                    mq.Open(this.queueManager, od, MQC.MQOO_INPUT_AS_Q_DEF, (err, hObj) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        this.queueHandle = hObj;
                        try {
                            // Créer les structures MQMD et MQGMO
                            const mqmd = new mq.MQMD();
                            const gmo = new mq.MQGMO();
                            // Configurer les options de Get
                            gmo.Options = MQC.MQGMO_NO_SYNCPOINT |
                                MQC.MQGMO_NO_WAIT |
                                MQC.MQGMO_CONVERT |
                                MQC.MQGMO_FAIL_IF_QUIESCING;
                            // Créer un buffer pour recevoir le message
                            const buf = Buffer.alloc(1024);
                            // Lire le message de manière synchrone
                            mq.GetSync(hObj, mqmd, gmo, buf, (err, len) => {
                                if (err) {
                                    if (err.mqrc === MQC.MQRC_NO_MSG_AVAILABLE) {
                                        mq.Close(hObj, 0, (err) => {
                                            if (err) {
                                                console.error('Error closing queue:', err);
                                            }
                                            resolve(null);
                                        });
                                    }
                                    else {
                                        reject(err);
                                    }
                                    return;
                                }
                                // Fermer la file
                                mq.Close(hObj, 0, (err) => {
                                    if (err) {
                                        console.error('Error closing queue:', err);
                                    }
                                    // Convertir le buffer en string
                                    const message = buf.slice(0, len).toString('utf8');
                                    resolve(message);
                                });
                            });
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}
exports.MQService = MQService;
