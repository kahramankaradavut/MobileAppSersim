import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';  
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon, 
  IonTitle, 
  IonItem,
  IonInput,
  IonGrid, 
  IonRow, 
  IonCol, 
  IonImg, 
  IonFab, 
  IonFabButton, 
  IonLabel,
  IonSelect,
  IonSelectOption } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/auth/auth.service';

// İkonlar
import { addIcons } from 'ionicons';
import { camera, logOutOutline, sendOutline, scanCircleOutline } from 'ionicons/icons';


@Component({
  standalone: true,
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonLabel, 
    FormsModule,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonFab,
    IonFabButton,
    IonSelect,
    IonSelectOption
  ],
})
export class Tab1Page {
  serialNumber: string = '';
  images: string[] = [];

  lengthUnit: number = 100;  // varsayılan birim
  lengthUnits: number[] = [70, 100, 120, 150]; // birim seçenekleri


  constructor(private authService: AuthService) {
    addIcons({ camera, logOutOutline, sendOutline, scanCircleOutline });
  }

  async scanBarcode() {
    try {

      const scanOptions = {
        hint: CapacitorBarcodeScannerTypeHint.ALL,  
        scanInstructions: 'Lütfen barkodu kameraya getirin',
        scanButton: true,
        scanText: 'Barkod Tara',
      };

      // Barkod taramasını başlat
      const result = await CapacitorBarcodeScanner.scanBarcode(scanOptions);

      if (result && result.ScanResult) {
        const scanned = result.ScanResult;
        
        if (scanned.length === 18) {
          const productCode = scanned.slice(0, 6);
          const dateCode = scanned.slice(6, 12);
          const extraCode = scanned.slice(12, 18);
      
          this.serialNumber = `${productCode}-${dateCode}-${extraCode}`;
          alert(`Barkod tarandı: ${this.serialNumber}`);
          console.log("Barkod ilk:", `${productCode}`);
          console.log("Barkod ikinci:", `${dateCode}`);
          console.log("Barkod üçüncü:", `${extraCode}`);
        } else {
          alert("Barkod 18 haneli olmalıdır.");
        }
      }      
    } catch (error) {
      console.error("Barkod tarama hatası:", error);
      alert("Barkod tarama sırasında bir hata oluştu.");
    }
  }

  

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,  
      source: CameraSource.Prompt,
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
      base64Images: this.images.map(img => img.replace(/^data:image\/jpeg;base64,/, '')),
      lengthUnit: this.lengthUnit
    };

    try {
      const token = this.authService.getToken();

      const response = await fetch('http://localhost:5113/api/PhotoUpload', {
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
