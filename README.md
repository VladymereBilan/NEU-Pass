# NEU-Pass

Mobile-based visitor management prototype for New Era University.

## Tech Stack
- Expo React Native + TypeScript
- Expo Router navigation
- Local SQLite database
- Expo Camera for ID/face capture and QR scan
- QR code generation

## Demo Accounts
- Guard: guard01 / guard123
- Admin: admin01 / admin123

## Run Locally
- npm install
- npx expo start

## APK Build (EAS)
- npx eas build -p android --profile preview

## iOS Testing
Install the Expo Go app on your iPhone, then scan the QR code shown by `npx expo start` to open the project.

## Capstone Notes
This prototype uses local SQLite and manual verification workflows for OCR and facial recognition. Replace these prototype services with real OCR and face comparison in Capstone 2.
