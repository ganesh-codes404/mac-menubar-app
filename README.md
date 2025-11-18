# Tasked-up

A lightweight, distraction-free task manager that lives in your Operating System's menu bar. Designed to be super minimal, super fast, and always out of your way.

## Features 
- Add, Delete and Mark tasks.
- Persistent History(saved in top right corner, along with timestamps, for 7 days).
- Real time CPU Temperature Display using osx(buggy still fixing).
- Runs a seperate instance of your default browser to prevent distractions.
- Once logged in, the cookies will remain as long as your browser holds them for.
- Secure and no data collection, the settings of your browser will reflect in this app.
- You can customize the icon that is visible in the menu bar.

## Installation Guide

Step 1: Clone this repo
```
git clone https://github.com/ganesh-codes404/mac-menubar-app
```
Step 2: Install dependencies and run
```
npm i 
npm start
```
Step 3: To change the icon in the menu bar, find this line in `main.js` and change it accordingly
```
  icon: path.join(__dirname, "/icons/1.jpg"),
```

### You can also make this into a desktop app with these following steps:
Step 1: Install the correct electron and also the electron builder
```
 npm install --save-dev electron-builder
```
Step 2: Make a `.icns` icon for your app(if macOS) and add it in the `package.json`
```
"icon": "icons/icon.icns",
```
Step 3: Make sure there are no errors and run this command to build a `.dmg` or `.exe` file
```
npm run dist
```
Step 4: Open the `.dmg` or `.exe` file from Finder or FileExplorer and open it, it should take you to the installation screen


## Screenshots

<img width="348" height="464" alt="SS2" src="https://github.com/user-attachments/assets/97410714-3404-4619-8073-dacfc1c013be" />

<img width="348" height="468" alt="SS1" src="https://github.com/user-attachments/assets/f8bddd52-64ff-4932-a1a3-064ea3ecfd47" />

<img width="356" height="461" alt="SS3" src="https://github.com/user-attachments/assets/00109419-813d-4c3c-888b-e05c3471fb2c" />

<img width="356" height="459" alt="SS4" src="https://github.com/user-attachments/assets/6fb618e3-f86c-4df7-ba72-1cf1ce522f9c" />

<img width="1095" height="767" alt="SS5" src="https://github.com/user-attachments/assets/0dec1398-447a-42d1-8054-97322ba07cdd" />





