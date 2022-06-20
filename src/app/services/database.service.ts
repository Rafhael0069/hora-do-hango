import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { DataUser } from '../models/data-user';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}

 /*  async uploadDataUser(cameraFile: Photo, user: User, nome: string, email: string) {

    console.log(user.email);
    const path = `ImageUsuarios/${user.uid}.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');
      const imageUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(this.firestore, `Usuarios/${user.uid}`);
      await setDoc(userDocRef, {
        nome, email, imageUrl
      });
      return true;
    } catch (e) {
      return null;
    }
  } */

  async uploadImage(cameraFile: Photo , pathImg: string, pathUserData: string) {

    const storageRef = ref(this.storage, pathImg);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(this.firestore, pathUserData);
      await updateDoc(userDocRef, {
        imageUrl,
      });
      return imageUrl;
    } catch (e) {
      return null;
    }
  }

  async uploadDados(endereco: string, name: string, email: string) {
    const user = this.auth.currentUser;
    try {
      const userDocRef = doc(this.firestore, endereco);
      await setDoc(userDocRef, {
        name, email
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async updateDados(endereco: string, name: string, email: string) {
    const user = this.auth.currentUser;
    try {
      const userDocRef = doc(this.firestore, endereco);
      await updateDoc(userDocRef, {
        name, email
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  getUserProfile(endereco: string) {
    const userDocRef = doc(this.firestore, endereco);
    return docData(userDocRef);
  }
}
