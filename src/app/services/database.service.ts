import { Injectable } from '@angular/core';
import {
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { Photo, Camera } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private firestore: Firestore, private storage: Storage) {}

  async uploadImage(cameraFile: Photo, pathImg: string) {
    const storageRef = ref(this.storage, pathImg);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      return imageUrl;
    } catch (e) {
      return null;
    }
  }

  async uploadDados(
    endereco: string,
    name: string,
    email: string,
    imageUrl: string
  ) {
    try {
      const userDocRef = doc(this.firestore, endereco);
      await setDoc(userDocRef, {
        name,
        email,
        imageUrl,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async uploadDadosComida(
    endereco: string,
    nameFood: string,
    mainIngredients: string,
    dataPublicaca: string,
    userUid: string
  ) {
    try {
      const userDocRef = doc(this.firestore, endereco);
      await setDoc(userDocRef, {
        nameFood,
        mainIngredients,
        dataPublicaca,
        userUid,
      });
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateDados(endereco: string, name: string, email: string) {
    try {
      const userDocRef = doc(this.firestore, endereco);
      await updateDoc(userDocRef, {
        name,
        email,
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
