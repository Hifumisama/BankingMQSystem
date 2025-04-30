#!/bin/bash

# Attendre que le serveur MQ soit prêt
echo "Waiting for MQ server to be ready..."
sleep 30

# Se connecter au serveur MQ et créer la file d'attente
echo "Creating queue..."
docker exec ibmmq runmqsc QM1 << EOF
# Création d'une file d'attente locale nommée BANKING.QUEUE
# QLOCAL : file d'attente stockée physiquement sur le Queue Manager local (QM1)
# Cette file sera utilisée pour stocker les messages de notre système bancaire
DEFINE QLOCAL('BANKING.QUEUE')
EOF

echo "Queue created successfully!" 