import { Component } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { camera } from 'ionicons/icons';
import { addIcons } from 'ionicons';



@Component({
  standalone: true,
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ExploreContainerComponent, IonicModule, FormsModule, CommonModule, ],
})
export class Tab1Page {
  serialNumber: string = '';
  images: string[] = [];

  constructor() { addIcons({ camera }); }

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

    for (let i = 0; i < this.images.length; i++) {
      const fileName = `image_${i}.jpeg`;
      const path = `${this.serialNumber}/${fileName}`;

      await Filesystem.writeFile({
        path,
        data: this.images[i],
        directory: Directory.Documents, 
      });
    }

    console.log('RREADDIR: ' ,Filesystem.readdir);
    alert("Fotoğraflar başarıyla kaydedildi.");
    this.images = [];
    this.serialNumber = '';
  }








  // serialNumber: string = '';
  // userName: string = 'Kullanıcı Adı'; // Bu, giriş yapan kullanıcının ismi olmalı
  // capturedPhotos: string[] = [];

  // constructor(private photoService: PhotoService) {addIcons({ camera });}

  // async capturePhoto() {
  //   if (this.serialNumber.trim() === '') {
  //     alert('Seri numarası boş olamaz!');
  //     return;
  //   }

  //   try {
  //     const savedFile = await this.photoService.capturePhoto(this.serialNumber, this.userName);
  //     this.capturedPhotos.push(savedFile); // Fotoğrafı listeye ekle
  //     console.log('Fotoğraf başarıyla kaydedildi:', savedFile);
  //   } catch (error) {
  //     console.error('Fotoğraf çekme hatası:', error);
  //   }
  // }
}
