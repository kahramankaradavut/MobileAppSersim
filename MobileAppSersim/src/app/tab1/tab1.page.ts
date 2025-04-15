import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { camera } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/auth/auth.service';
import { logOutOutline, sendOutline } from 'ionicons/icons';


@Component({
  standalone: true,
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ IonicModule, FormsModule, CommonModule],
})
export class Tab1Page {
  serialNumber: string = '';
  images: string[] = [];

  constructor(private authService: AuthService) { addIcons({ camera , logOutOutline, sendOutline}); }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    const base64Data = 'data:image/jpeg;base64,' + image.base64String;
    this.images.push(base64Data);
  }

  async saveImages() {
    if (!this.serialNumber) {
      alert("Lütfen seri numarası giriniz.");
      return;
    }
  
    const payload = {
      serialNumber: this.serialNumber,
      base64Images: this.images.map(img => img.replace(/^data:image\/jpeg;base64,/, ''))
    };
  
    try {
      const token = this.authService.getToken();

      const response = await fetch('https://api2.sersim.com.tr/api/PhotoUpload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      alert(result.message);
      this.images = [];
      this.serialNumber = '';
    } catch (error) {
      console.error("API hatası:", error);
      alert("Fotoğraflar gönderilemedi.");
    }
  }

  async logout() {
    this.authService.logout();
  }
  
}