import { DatabaseService } from './../../services/database.service';
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
import { DataUser } from 'src/app/models/data-user';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {
  profile = null;
  image = null;
  imageUrlView = null;
  registerForm: FormGroup;

  constructor(
    private avatarService: AvatarService,
    public photoService: PhotoService,
    private dbService: DatabaseService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router
  ) {
    /* this.avatarService.getUserProfile().subscribe((data) => {
      this.profile = data;
    }); */

    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5)]],
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
    if (user) {
      /*const result = await this.dbService.uploadDados(
        `usuarios/${user.user.uid}`,
        this.registerForm.value.name,
        this.registerForm.value.email
      );
       if (result) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
        await loading.dismiss();
      } else {
        await loading.dismiss();
        this.presentAlert(
          'Falha ao salvar dados de usuário',
          'Por favor, tente novamente!'
        );
      } */
      const imgName = `${user.user.uid}.png`;
      const pathUserData = `usuarios/${user.user.uid}`;
      const imgUrl = await this.dbService.uploadImage(
        this.image,
        `imageUsuarios/${user.user.uid}${imgName}.png`
      );
      if (imgUrl) {
        const result = await this.dbService.uploadDados(
          pathUserData,
          this.registerForm.value.name,
          this.registerForm.value.email,
          imgUrl
        );
        if (result) {
          this.router.navigateByUrl('/home', { replaceUrl: true });
          await loading.dismiss();
        } else {
          await loading.dismiss();
          this.presentAlert(
            'Falha ao salvar dados de usuário',
            'Por favor, tente novamente!'
          );
        }
      } else {
        await loading.dismiss();
        this.presentAlert(
          'Falha ao salvar imagem',
          'Por favor, tente novamente!'
        );
      }
    } else {
      await loading.dismiss();
      this.presentAlert(
        'Falha ao cadastra usuario',
        'Por favor, tente novamente!'
      );
    }

    /*
    if (user) {
      const result = this.dbService.uploadDataUser(
        this.image,
        user.user,
        this.registerForm.value.name,
        this.registerForm.value.email
      );
      if (!result) {
        console.log(result);
        await loading.dismiss();
        this.presentAlert(
          'Falha no upload',
          'Ocorreu um problema ao enviar seus dados!'
        );
      } else {
        console.log('sucesso ao fazer upload de dados');
        await loading.dismiss();
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    } else {
      await loading.dismiss();
      this.presentAlert('Falha no registro', 'Por favor, tente novamente!');
    } */
  }

  async changeImage() {
    this.image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.imageUrlView = 'data:image/jpg;base64,' + this.image.base64String;

    /* const image = this.photoService.addNewToGallery();

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.avatarService.uploadImage(image, );
      loading.dismiss();

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your avatar.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    } */
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
