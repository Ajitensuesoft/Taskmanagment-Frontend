// src/components/PushButton.tsx
import React, { useState } from 'react';

// Replace with your backend's public VAPID key
const publicVapidKey1=import.meta.env.VITE_VAPID_PUBLIC_KEY;
console.log("publicVapidKey",publicVapidKey1)
const publicVapidKey = publicVapidKey1;
// interface subs{
//    uservisible:boolean,
//    applicationServerKey: Uint8Array
// }

// Utility function to convert VAPID key
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const PushButton: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribeUser = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging is not supported.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission denied.');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:urlBase64ToUint8Array(publicVapidKey) ,
        //here is a type error of arraybuffer
      });

      // Mock user ID - replace with a real user ID from your auth system
      const userId = localStorage.getItem("userId");
      console.log("userId",userId);
    //   const userId = '60b8d295f7d3a6c1d4a98b71';

      await fetch('http://localhost:5000/api/v1/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subscription }),
      });

      setIsSubscribed(true);
      console.log('User successfully subscribed and sent to backend.');
    } catch (error) {
      console.error('Failed to subscribe the user:', error);
    }
  };

  return (
    <button onClick={subscribeUser} disabled={isSubscribed}>
      {isSubscribed ? 'Subscribed!' : 'Subscribe to Notifications'}
    </button>
  );
};

export default PushButton;