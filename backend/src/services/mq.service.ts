import dotenv from 'dotenv';
const mq = require("ibmmq");
const MQC = mq.MQC; // Want to refer to this export directly for simplicity

dotenv.config();

export class MQService {
  private queueManager: any = null;
  private queueHandle: any = null;
  private ok = true;
  
  private readonly config = {
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

  public async initialize(): Promise<void> {
    await this.connect();
  }

  private async connect(): Promise<void> {
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
      this.queueManager = await new Promise((resolve, reject) => {
        mq.Connx(this.config.queueManagerName, cno, (err: Error | null, hConn: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(hConn);
          }
        });
      });

      console.log('Connected to IBM MQ successfully');
    } catch (error) {
      console.error('Error connecting to IBM MQ:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.queueManager) {
      try {
        await new Promise((resolve, reject) => {
          mq.Disc(this.queueManager, (err: Error | null) => {
            if (err) {
              reject(err);
            } else {
              resolve(null);
            }
          });
        });
        this.queueManager = null;
        console.log('Disconnected from IBM MQ');
      } catch (error) {
        console.error('Error disconnecting from IBM MQ:', error);
        throw error;
      }
    }
  }

  public isConnected(): boolean {
    return this.queueManager !== null;
  }

  /**
   * Envoie un message dans la file d'attente
   * @param message Le contenu du message à envoyer
   * @returns L'identifiant du message envoyé
   */
  public async sendMessage(message: string): Promise<string> {
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
        mq.Open(this.queueManager, od, MQC.MQOO_OUTPUT, (err: Error | null, hObj: any) => {
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
            mq.Put(hObj, mqmd, pmo, message, (err: Error | null) => {
              if (err) {
                reject(err);
                return;
              }

              // Récupérer l'ID du message
              const messageId = mqmd.MsgId.toString('hex');
              
              // Fermer la file
              mq.Close(hObj, 0, (err: Error | null) => {
                if (err) {
                  console.error('Error closing queue:', err);
                }
                resolve(messageId);
              });
            });
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Reçoit un message de la file d'attente
   * @returns Le contenu du message reçu ou null si aucun message n'est disponible
   */
  public async receiveMessage(): Promise<string | null> {
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
        mq.Open(this.queueManager, od, MQC.MQOO_INPUT_AS_Q_DEF, (err: Error | null, hObj: any) => {
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
            mq.GetSync(hObj, mqmd, gmo, buf, (err: any, len: number) => {
              if (err) {
                if (err.mqrc === MQC.MQRC_NO_MSG_AVAILABLE) {
                  mq.Close(hObj, 0, (err: Error | null) => {
                    if (err) {
                      console.error('Error closing queue:', err);
                    }
                    resolve(null);
                  });
                } else {
                  reject(err);
                }
                return;
              }

              // Fermer la file
              mq.Close(hObj, 0, (err: Error | null) => {
                if (err) {
                  console.error('Error closing queue:', err);
                }
                // Convertir le buffer en string
                const message = buf.slice(0, len).toString('utf8');
                resolve(message);
              });
            });
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
} 