import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
  IonicModule, CommonModule, FormsModule
  ]
})
export class LoginPage {
  isLoading = false; // Yükleme durumu
  message = ''; // Kullanıcıya gösterilecek mesaj
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private router: Router,  
    private loadingCtrl: LoadingController,
  ) {}

  async login() {
    this.isLoading = true; // Yükleme başlıyor
    this.message = 'Giriş yapılıyor, lütfen bekleyin...';
    console.log('Giriş yapılıyor...');

    // const loading = await this.loadingCtrl.create({
    // message: 'Giriş yapılıyor...',
    // spinner: 'crescent', // Dönebilen spinner
    // });

    // await loading.present();
    console.log('Giriş yapılıyor...');

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: async (res) => {
        this.authService.setToken(res.token, res.role);

        this.isLoading = false;
        this.message = ''; // Mesajı kaldır
        
        // await loading.dismiss();
        console.log('Giriş başarılı:', res);
        console.log('Kullanıcı rolü:', res.role);
        
        if (res.role === 'SuperAdmin') {
          try {
            console.log('SuperAdmin');
          this.router.navigate(['/superAdmin']);
          } catch (error) {
            console.error('Hata:', error);
          }
        } else {
          console.log('Kullanıcı');
          this.navCtrl.navigateRoot('/tabs');
        }

      },
      error: async (res) => {
        console.log('Giriş hatası:', res);
        this.message = 'Giriş başarısız, lütfen tekrar deneyin.';
        this.isLoading = false;
        // await loading.dismiss();
      },
    });
  }
}
