import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { PhotoService } from 'src/app/services/photo.service';

/* import { AngularFireAuth } from '@angular/fire/compat/auth'; */
import { ValidateConfirmPassword } from 'src/validators/confirmPassword';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {
  profile = null;
  registerForm: FormGroup;

  constructor(
    private avatarService: AvatarService,
    public photoService: PhotoService,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5)]],
      age: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        null,
        [Validators.required, Validators.minLength(5), ValidateConfirmPassword],
      ],
    });
  }

  submitForm() {
    /* this.afAuth
         .createUserWithEmailAndPassword(
          this.registerForm.value.email,
          this.registerForm.value.password
        )
        .then((response) => {
          this.presentAlert('Cadastro', 'Usuário cadastrado com sucesso!');
          this.navCtrl.navigateForward('start');
        })
        .catch((error) => {
          if(error.code === 'auth/email-already-in-use'){
            this.presentAlert('Error','E-mail ja cadastrado');
          }else if(error.code === 'auth/weak-password'){
            this.presentAlert('Error','Essa senha é muito facil.');
          }else{
            this.presentAlert('Error',error.message);
          }
        }); */
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.registerForm.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.presentAlert('Registration failed', 'Please try again!');
    }
  }

  async changeImage() {

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
    });

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();

      if (!result) {
        const alert = await this.alertCtrl.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your avatar.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  async presentAlert(title: string, subTitle: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: subTitle,
      buttons: ['OK'],
    });
    alert.present();
  }
  ngOnInit() {}

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
