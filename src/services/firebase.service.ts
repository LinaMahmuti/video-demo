import { Injectable } from '@angular/core';
import { Firestore } from '@firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app'
import { getFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firebaseApp: FirebaseApp;
  firestore: Firestore;

  firebaseConfig = {
    apiKey: "AIzaSyBnUs5La09bhlIO4ukyRp0jkD4k9H9e2K0",
    authDomain: "fir-video-5cf96.firebaseapp.com",
    projectId: "fir-video-5cf96",
    storageBucket: "fir-video-5cf96.appspot.com",
    messagingSenderId: "978345367510",
    appId: "1:978345367510:web:0aa8f371e8df4b1826f677"
  };

  constructor() {
    this.firebaseApp = initializeApp(this.firebaseConfig);
    this.firestore = getFirestore();
  }
}
