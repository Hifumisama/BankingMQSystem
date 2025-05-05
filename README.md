# Banking MQ System

## Description du Projet

Le projet Banking MQ System est une application de suivi de messages sur IBM MQ, permettant la gestion et le stockage des messages et des partenaires dans une base de données. Cette solution offre une interface utilisateur moderne pour interagir avec IBM MQ tout en maintenant une trace des opérations effectuées.

## Architecture du Projet

```
BankingMQSystem/
├── backend/               # Backend Node.js
│   ├── models/           # Modèles de données
│   ├── routes/           # Routes API
│   └── shared/           # Interfaces partagées
├── frontend/             # Application Angular
│   ├── src/
│   │   ├── app/
│   │   └── assets/
└── shared/               # Code partagé entre frontend et backend
```

### Composants Principaux

- **Backend** : Gère la logique métier, l'interaction avec IBM MQ et la base de données
- **Frontend** : Interface utilisateur développée avec Angular 19
- **Shared** : Contient les interfaces et types partagés entre le frontend et le backend

## Fonctionnalités

### Gestion des Partenaires
- Consultation de la liste des partenaires
- Ajout de nouveaux partenaires
- Suppression de partenaires existants

### Gestion des Messages
- Consultation des messages
- Ajout de nouveaux messages
- Suivi des messages dans IBM MQ

## Installation et Démarrage

### Prérequis
- Docker et Docker Compose
- IBM MQ Server

### Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd BankingMQSystem
```

2. Lancer l'application avec Docker Compose :
```bash
docker-compose up
```

Cette commande va :
- Construire les images Docker pour le frontend et le backend
- Installer toutes les dépendances nécessaires
- Démarrer les conteneurs avec la configuration appropriée

### Redémarrage du Serveur IBM MQ

Si le serveur IBM MQ ne répond pas, suivez ces étapes :

1. Arrêter le serveur :
```bash
endmqweb
```

2. Redémarrer le conteneur Docker :
```bash
docker-compose restart mq
```

## Technologies Utilisées

- **Frontend** : Angular 19, TailwindCSS
- **Backend** : Node.js, Express
- **Base de données** : MongoDB avec Mongoose
- **Message Queue** : IBM MQ
- **Conteneurisation** : Docker, Docker Compose

## Contribution

[Instructions pour contribuer au projet]

## Licence

[Type de licence]
