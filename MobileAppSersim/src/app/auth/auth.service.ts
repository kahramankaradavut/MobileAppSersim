import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl = 'http://localhost:5113/api/Users';
  private tokenKey = 'token';
  private roleKey = 'role';

  isLoggedIn = new BehaviorSubject<boolean>(false);
  userRole = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }) {
    try {
      return this.http.post<any>(`${this.apiUrl}/login`, credentials);
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Hata fırlat
      
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  setToken(token: string, role: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);
    this.isLoggedIn.next(true);
    this.userRole.next(role);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getRole() {
    return localStorage.getItem(this.roleKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.isLoggedIn.next(false);
    this.userRole.next(null);
    this.router.navigate(['/login']);
  }

  isSuperAdmin() {
    return this.getRole() === 'SuperAdmin';
  }

}
