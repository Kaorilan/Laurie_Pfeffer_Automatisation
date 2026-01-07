<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
  <br><br><br>
</p>

# Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:
- Docker
- NodeJs

# Installation et démarrage
Clonez le projet pour le récupérer
``` 
git clone https://github.com/OpenClassrooms-Student-Center/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2
```
Pour démarrer l'API avec ça base de données.
```
docker compose up -d
```
# Pour démarrer le frontend de l'applicatif
Rendez-vous dans le dossier frontend
```
cd ./frontend
```
Installez les dépendances du projet
```
npm i
ou
npm install (si vous préférez)
```

# Tests Automatisés Eco Bliss Bath

## Prérequis
- Frontend : `npm start` → http://localhost:4200
- Backend : Docker → http://localhost:8081


## Lancement tests en mode terminal
```bash
npx cypress run
```

## Lancement tests avec Cypress Chrome
```bash
npx cypress open
```

### Tests implémentés

- Tests API (10 requêtes) : GET /orders (avec/sans auth), GET /products/{id}, POST /login (cas valide/invalide),  POST /orders/add (produit disponible/produit rupture), PUT /orders/add (produit disponible/rupture), POST /reviews.
- Smoke tests : présence formulaire connexion, boutons panier après connexion, bouton consulter un produit, bouton ajouter un produit au panier.
- Test XSS : 5 payloads classiques dans l’espace avis.
- Tests fonctionnels critiques :
    - Connexion
    - Panier : ajout produit, limites quantité (négatif bloqué, >20 limité à 20), décrément stock, vérification du stock, suppression du panier.


### Résultats et anomalies

Voir le bilan de campagne de test automatisé joint (PDF) pour le détail des résultats, anomalies détectées et recommandations.


