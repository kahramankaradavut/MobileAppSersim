import { Component } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { PhotoService } from '../services/photo.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { camera } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { HttpClientModule } from '@angular/common/http'; 



@Component({
  standalone: true,
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ExploreContainerComponent, IonicModule, FormsModule, CommonModule, HttpClientModule],
})
export class Tab1Page {

  selectedFile: File | null = null;

  constructor(public photoService: PhotoService) { addIcons({ camera }); }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadPhoto() {
    if (this.selectedFile) {
      this.photoService.uploadImage(this.selectedFile).subscribe({
        next: (res) => console.log('Başarılı:', res),
        error: (err) => console.error('Hata:', err)
      });
    }
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
