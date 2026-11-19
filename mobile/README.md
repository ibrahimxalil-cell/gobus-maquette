# GoBus — application mobile (prototype)

Cette version est une application de démonstration pour **iPhone, iPad, Android et tablettes Android**, construite avec Expo / React Native. Elle ne dépend pas d'images téléchargées : l'aperçu de carte et les icônes sont dessinés avec les composants intégrés, pour éviter les images manquantes.

## Pour la lancer simplement sur votre téléphone

1. Installez **Expo Go** depuis l'App Store (iPhone/iPad) ou Google Play (Android).
2. Sur un ordinateur, installez Node.js depuis [nodejs.org](https://nodejs.org).
3. Téléchargez le dépôt GitHub en ZIP puis extrayez-le.
4. Ouvrez le dossier `mobile` dans le dossier extrait.
5. Dans ce dossier, ouvrez un terminal (Windows : cliquez dans la barre d'adresse de l'Explorateur, tapez `cmd`, puis Entrée).
6. Tapez `npm install` puis Entrée. Une fois terminé, tapez `npx expo start`.
7. Scannez le QR code affiché avec Expo Go. Téléphone et ordinateur doivent être sur le même réseau Wi-Fi.

Pour lancer le simulateur iOS, il faut un Mac avec Xcode. Pour un premier essai, Expo Go sur téléphone est plus simple.

## Ce que vous pouvez tester

- Passer du profil **Parent** au profil **Accompagnateur**.
- Ouvrir les écrans Accueil, Élèves, Alertes et Trajets.
- Pointer les élèves et modifier leur état de présence.
- Tester l'affichage sur téléphone et tablette.

**Important :** le bus, son emplacement, les horaires et les notifications sont simulés. Cette maquette ne collecte pas de vraies données d'enfants, n'accède pas au GPS du bus et n'envoie pas de notifications réelles.
