import { Injectable } from '@angular/core';
import {
  doc,
  docData,
  Firestore,
  collection,
  query,
  where,
  getDocs,
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
import { Observable } from 'rxjs/internal/Observable';

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

  async uploadDadosUser(
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

  async updateDadosUser(
    endereco: string,
    name: string,
    email: string,
    imageUrl: string
  ) {
    try {
      const userDocRef = doc(this.firestore, endereco);
      await updateDoc(userDocRef, {
        name,
        email,
        imageUrl,
        lastWeekVote: 0,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async updateDadosUserVotes(endereco: string, lastWeekVote: number) {
    try {
      const userDocRef = doc(this.firestore, endereco);
      await updateDoc(userDocRef, {
        lastWeekVote,
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
    imageUrl: string,
    dataPublicaca: string,
    weekNumber: number,
    foodUid: string,
    userUid: string,
    votes: number
  ) {
    try {
      const userDocRef = doc(this.firestore, endereco);
      await setDoc(userDocRef, {
        nameFood,
        mainIngredients,
        imageUrl,
        dataPublicaca,
        weekNumber,
        foodUid,
        userUid,
        votes,
      });
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateDadosComida(endereco: string, votes: number) {
    try {
      const userDocRef = doc(this.firestore, endereco);
      await updateDoc(userDocRef, {
        votes,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async getColectionsComidas(endereco: string) {
    //const q = query(collection(db, 'cities'), where('capital', '==', true));

    let listFoods: [];
    const userDocRef = query(collection(this.firestore, endereco));
    const querySnapshot = await getDocs(userDocRef);

    return querySnapshot.docs;
  }

  getUserProfile(endereco: string) {
    const userDocRef = doc(this.firestore, endereco);
    return docData(userDocRef);
  }

  getFoodList(enereco: string) {
    const list = collection(this.firestore, enereco);
    console.log(list);
    return list;
  }

}
