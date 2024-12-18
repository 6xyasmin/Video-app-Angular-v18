import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private isLoggedIn = false;

  constructor(private router: Router) {}

  login( password: string): boolean {
    if (password === 'jas') {
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  getIsLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

}
