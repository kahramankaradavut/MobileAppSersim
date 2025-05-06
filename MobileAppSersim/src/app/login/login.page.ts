import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { 
  IonInputPasswordToggle, 
  IonHeader, 
  IonToolbar, 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonItem, 
  IonButton, 
  IonInput 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
  CommonModule,
  FormsModule,
  IonInputPasswordToggle, 
  IonHeader,
  IonToolbar,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton
  ]
})
export class LoginPage {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router,  
    private loadingCtrl: LoadingController,
  ) {}

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Giriş yapılıyor...',
      spinner: 'circles'
    });
    await loading.present();

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: async (res) => {
        await loading.dismiss();

        this.authService.setToken(res.token, res.role);

        const toast = await this.toastController.create({
          message: 'Giriş başarılı!',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
        
        if (res.role === 'SuperAdmin') {
          this.router.navigate(['/superAdmin']);
        } else {
          this.router.navigateByUrl('/', { replaceUrl: true }).then(() => {
            this.router.navigateByUrl('/tabs/tab1');
          });
        }
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Giriş hatası:', err);
  
        const toast = await this.toastController.create({
          message: 'Kullanıcı adı veya şifre hatalı!',
          duration: 2500,
          color: 'danger',
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }
}
