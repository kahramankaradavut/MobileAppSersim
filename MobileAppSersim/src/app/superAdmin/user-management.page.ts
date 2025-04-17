import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  // IonHeader,
  // IonToolbar,
  // IonButtons,
  // IonButton,
  // IonContent,
  // IonCard,
  // IonCardHeader,
  // IonCardTitle,
  // IonCardContent,
  // IonItem,
  // IonInput,
  // IonSelect,
  // IonSelectOption,
  // IonList,
  // IonLabel,
  // IonModal,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

import { UserService } from '../services/user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // IonHeader,
    // IonToolbar,
    // IonButtons,
    // IonButton,
    // IonContent,
    // IonCard,
    // IonCardHeader,
    // IonCardTitle,
    // IonCardContent,
    // IonItem,
    // IonInput,
    // IonSelect,
    // IonSelectOption,
    // IonList,
    // IonLabel,
    // IonModal
  ]
})
export class UserManagementPage {
  users: any[] = [];
  newUser = { username: '', passwordHash: '', role: '' };
  isEditModalOpen = false;
  selectedUser: any = {};

  constructor(
    private userService: UserService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    const loading = await this.loadingCtrl.create({
      message: 'Veriler getiriliyor...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.userService.getUsers().subscribe((data) => {
        this.users = data;
      });

      const toast = await this.toastController.create({
        message: 'Veri başarıyla getirildi!',
        duration: 1500,
        color: 'success'
      });
      toast.present();
    } catch (error) {
      console.error('Veriler alınamadı:', error);
      const toast = await this.toastController.create({
        message: 'Veri getirme hatası: ' + ((error as any).message || 'Bilinmeyen hata'),
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  async addUser() {
    if (!this.newUser.username || !this.newUser.passwordHash || !this.newUser.role) {
      const toast = await this.toastController.create({ message: 'Lütfen tüm alanları doldurun!', color: 'warning', duration: 2000 });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Kullanıcı ekleniyor...',
      spinner: 'crescent'
    });
    await loading.present();

    this.userService.addUser(this.newUser).subscribe({
      next: async () => {
        this.newUser = { username: '', passwordHash: '', role: '' };
        const toast = await this.toastController.create({ message: 'Kullanıcı eklendi!', color: 'success', duration: 2000 });
        toast.present();
        loading.dismiss();
        this.ionViewWillEnter();
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Kullanıcı ekleme hatası:', error);
        const toast = await this.toastController.create({ message: 'Kullanıcı eklenirken hata oluştu!', color: 'danger', duration: 2000 });
        toast.present();
      }
    });
  }

  async deleteUser(userId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Silme Onayı',
      message: 'Bu kullanıcıyı silmek istediğinize emin misiniz?',
      buttons: [
        { text: 'İptal', role: 'cancel' },
        {
          text: 'Sil',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Kullanıcı siliniyor...',
              spinner: 'crescent'
            });
            await loading.present();

            this.userService.deleteUser(userId).subscribe({
              next: async () => {
                await loading.dismiss();
                const toast = await this.toastController.create({
                  message: 'Kullanıcı silindi!',
                  color: 'success',
                  duration: 2000
                });
                await toast.present();
                this.ionViewWillEnter();
              },
              error: async (err) => {
                await loading.dismiss();
                console.error('Delete error:', err);
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  openEditModal(user: any) {
    this.selectedUser = { ...user };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  editUser(user: any) {
    this.selectedUser = { ...user };
    this.selectedUser.passwordHash = '';
    this.isEditModalOpen = true;
  }

  async updateUser() {
    const loading = await this.loadingCtrl.create({
      message: 'Güncelleniyor...',
      spinner: 'crescent'
    });
    await loading.present();

    this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
      next: async () => {
        this.isEditModalOpen = false;
        const toast = await this.toastController.create({ message: 'Kullanıcı güncellendi!', duration: 2000, color: 'success' });
        toast.present();
        loading.dismiss();
        this.ionViewWillEnter();
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Kullanıcı güncelleme hatası:', error);
      }
    });

    this.closeEditModal();
  }

  async logout() {
    this.authService.logout();
  }
}
