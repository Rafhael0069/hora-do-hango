import { Injectable } from '@angular/core';
import {
  doc,
  docData,
  Firestore,
  collection,
  query,
  getDocs,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { Photo, Camera } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(
    private firestore: Firestore,
    private storage: Storage,
    public alertCtrl: AlertController
  ) {}

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
    pathUser: string,
    name: string,
    matriculation: string,
    email: string,
    imageUrl: string
  ) {
    try {
      const userDocRef = doc(this.firestore, pathUser);
      await setDoc(userDocRef, {
        name,
        matriculation,
        email,
        imageUrl,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async updateDadosUser(
    pathUser: string,
    name: string,
    matriculation: string,
    email: string,
    imageUrl: string
  ) {
    try {
      const userDocRef = doc(this.firestore, pathUser);
      await updateDoc(userDocRef, {
        name,
        email,
        matriculation,
        imageUrl,
        lastWeekVote: 0,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async updateDadosVotes(
    pathUser: string,
    pathFood: string,
    lastWeekVote: number,
    votes: number
  ) {
    try {
      const userDocRef = doc(this.firestore, pathUser);
      await updateDoc(userDocRef, {
        lastWeekVote,
      });
      const foodDocRef = doc(this.firestore, pathFood);
      await updateDoc(foodDocRef, {
        votes,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async uploadDadosComida(
    pathFood: string,
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
      const userDocRef = doc(this.firestore, pathFood);
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

  async getColectionsComidas(pathFood: string, currentWeek: number) {
    const userDocRef = query(
      collection(this.firestore, pathFood),
      where('weekNumber', '==', currentWeek)
    );
    const querySnapshot = await getDocs(userDocRef);

    return querySnapshot.docs;
  }

  getUserProfile(pathUser: string) {
    const userDocRef = doc(this.firestore, pathUser);
    return docData(userDocRef);
  }

  getFoodDetails(pathFood: string) {
    const userDocRef = doc(this.firestore, pathFood);
    return docData(userDocRef);
  }

  async presentAlert(title: string, subTitle: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: subTitle,
      buttons: ['OK'],
    });
    alert.present();
  }

  getWeekNunber() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor(
      (currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil(days / 7);
  }
}
