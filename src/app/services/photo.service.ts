/* eslint-disable @typescript-eslint/member-ordering */
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];

  public photo;
  public imgPhotoUrl;

  constructor() {}

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.imgPhotoUrl = capturedPhoto.webPath;
    console.log('capturedPgoto: '+capturedPhoto);
    console.log('capturedPhoto.webPath: '+ capturedPhoto.webPath);
    return capturedPhoto;
    //console.log(capturedPhoto.webPath);

   /*  this.photos.unshift({
      filepath: 'soon...',
      webviewPath: capturedPhoto.webPath,
    });
 */
  }

  public async takePicture() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.imgPhotoUrl = capturedPhoto.webPath;
    return capturedPhoto;
    //console.log(capturedPhoto.webPath);

  }

}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
