# 🔐 Cryptify — End-to-End Encrypted Chat Application (React Native)

Cryptify is a secure real-time chat application built using **React Native** with full **End-to-End Encryption (E2EE)**. It ensures that only the sender and receiver can read messages — even the server cannot decrypt them.

The app is designed with a **privacy-first architecture**, combining strong cryptography, local authentication, push notifications, and offline-first message storage.

---

## 🚀 Features

* 🔒 End-to-End Encrypted Messaging (Hybrid RSA + AES)
* 🔑 Public-Private Key Encryption
* ⚡ Fast AES-CBC Message Encryption
* 🔁 Real-time Messaging
* 👤 Secure User Authentication
* 🔐 Local Authentication (Biometric / PIN) using Expo LocalAuthentication
* 🔔 Firebase Cloud Messaging (FCM) Push Notifications
* 💾 Local SQLite Database for Offline Access & Fast Loading

---

## 📱 Demo

<img width="1080" height="1080" alt="photo-collage png (1)" src="https://github.com/user-attachments/assets/010e3d6b-c382-48c3-9866-06f99b4ef7dd" />


## 🛡️ Security Architecture

Cryptify uses a **hybrid encryption model**:

* **AES-CBC (128-bit)** for fast message encryption
* **RSA** for secure symmetric key exchange
* Messages are encrypted **on the client**
* Server stores only encrypted data
* Private keys never leave the client device

### Encryption Flow

1. Generate a random AES symmetric key
2. Encrypt message using AES-CBC
3. Encrypt AES key using:

   * Recipient's public key
   * Sender's public key
4. Send encrypted payload to server

### Decryption Flow

1. Decrypt AES key using user's private key
2. Decrypt message using AES key
3. Display plaintext message

---

## 🔐 Local Authentication

Cryptify uses **Expo LocalAuthentication** to protect user data on the device.

* Supports Fingerprint & Face Unlock
* Prevents unauthorized access to chats
* Protects locally stored messages and private keys

---

## 🔔 Push Notifications (FCM)

* Uses **Expo + Firebase Cloud Messaging**
* Notifies users instantly on new messages
* Works even when the app is closed
* Supports background notifications

---

## 💾 Local SQLite Database

Cryptify stores encrypted messages locally using **SQLite** for:

* Offline access to chat history
* Faster message loading
* Reduced bandwidth usage
* Reduced decryption overhead for old messages

Messages are decrypted only when needed, improving performance on low-end devices.

---

## 🧩 Tech Stack

### Frontend

* React Native
* Expo
* JavaScript / TypeScript
* node-forge (Cryptography)
* Expo LocalAuthentication
* Expo SQLite

### Backend

* Node.js
* Express.js
* WebSockets / Socket.IO
* MongoDB
* Firebase Cloud Messaging

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/ritesh2004/Cryptify.git
cd Cryptify
```

---

### Install Dependencies

#### Client

```bash
npm install
```

---

### Run the Application

#### Start React Native App

```bash
npx expo start
```

Scan the QR code using the Expo Go app.

---

## 🔐 Encryption Implementation

* RSA for key exchange
* AES-CBC for message encryption
* node-forge cryptography library
* Client-side encryption & decryption

Server never sees plaintext data.

---

## 🧪 Future Improvements

* AES-GCM for authenticated encryption
* Perfect Forward Secrecy (Diffie-Hellman)
* Secure key storage using OS Keychain / Keystore
* Encrypted media sharing
* Self-destructing messages

---

## 👨‍💻 Author

**Ritesh Pramanik**
* GitHub: [ritesh2004](https://github.com/ritesh2004)
* LinkedIn: [ritesh-pramanik-8ba316260](https://www.linkedin.com/in/ritesh-pramanik-8ba316260)

---

## 📜 License

Copyright (c) 2025 [Ritesh Pramanik]

Permission is granted to view this source code for educational purposes only. Reproduction, modification, distribution, or use of this software in any form is prohibited without explicit written permission from the author.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---

**Cryptify — Private. Secure. Encrypted.**
