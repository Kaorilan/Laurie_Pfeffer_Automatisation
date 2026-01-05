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

- Tests API (6 requêtes) : GET /orders (avec/sans auth), GET /products/{id}, POST /login (cas valide/invalide), PUT /orders/add (produit disponible/rupture), POST /reviews
- Smoke tests : présence formulaire connexion et boutons panier après connexion
- Test XSS : 5 payloads classiques dans l’espace avis (stored XSS)
- Tests fonctionnels critiques :
    - Connexion front
    - Panier : ajout produit, limites quantité (négatif bloqué, >20 limité à 20), décrément stock, vérification via UI


### Résultats et anomalies

Voir le bilan de campagne de test automatisé joint (PDF) pour le détail des résultats, anomalies détectées et recommandations.


