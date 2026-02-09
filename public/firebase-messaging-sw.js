importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDQu1Jv5COix0v4LM_nzX7bze_-4IFi_FQ",
  authDomain: "novamert-8e119.firebaseapp.com",
  projectId: "novamert-8e119",
  storageBucket: "novamert-8e119.firebasestorage.app",
  messagingSenderId: "433067419137",
  appId: "1:433067419137:web:db85be5796826bfe70c200",
  measurementId: "G-WJQNNLL0TX"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});