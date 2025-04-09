import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';


@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private apiUrl = 'https://localhost:5113/api/upload'; 
  constructor(private http: HttpClient) {}
  
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('photo', file, file.name);
    return this.http.post(this.apiUrl, formData);
  }



  






//   // Fotoğraf çekme fonksiyonu
//   async capturePhoto(serialNumber: string, userName: string): Promise<string> {
//     const options: any = {
//       quality: 100,
//       allowEditing: false,
//       resultType: CameraResultType.Uri, // Fotoğrafın URI'sini alıyoruz
//     };

//     const photo = await Camera.getPhoto(options);

//     // Seri numarası ve kullanıcı ismi ile klasör oluştur
//     const folderName = `${serialNumber} (${userName})`;
//     const fileName = new Date().getTime() + '.jpg'; // Fotoğrafın ismini zaman damgası ile yapalım
//     const savedFile = await this.savePhoto(photo, folderName, fileName);

//     return savedFile;
//   }

//   // Fotoğrafı yerel depolama alanına kaydetme fonksiyonu
//   private async savePhoto(photo: any, folderName: string, fileName: string): Promise<string> {
//     const filePath = await Filesystem.writeFile({
//       path: `app_storage/${folderName}/${fileName}`,
//       data: photo.webPath,
//       directory: Directory.Data,
//     });

//     return filePath.uri; // Kaydedilen fotoğrafın yolunu döndürüyoruz
//   }
}
