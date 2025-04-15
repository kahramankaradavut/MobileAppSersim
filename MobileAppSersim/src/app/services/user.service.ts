import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5113/api/Users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUsers() {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addUser(user: any) {
    return this.http.post(this.apiUrl, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }

  updateUser(userId: number, userData: any) {
    return this.http.put(`${this.apiUrl}/${userId}`, userData, { headers: this.getAuthHeaders() });
  }
  

  // updateUser(userId: number, user: any) {
  //   return this.http.put(`${this.apiUrl}/${userId}`, user);
  // }
}
