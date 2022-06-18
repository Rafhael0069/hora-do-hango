import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { PhotoService } from 'src/app/services/photo.service';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ValidateConfirmPassword } from 'src/validators/confirmPassword';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    public photoService: PhotoService,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    /* public afAuth: AngularFireAuth, */
    public alertCtrl: AlertController) {
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

    async presentAlert(title: string, subTitle: string) {
      const alert = await this.alertCtrl.create({
        header: title,
        message: subTitle,
        buttons: ['OK'],
      });
      alert.present();
    }
  ngOnInit() {
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

}
