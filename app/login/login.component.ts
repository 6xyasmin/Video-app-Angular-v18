import { Component } from '@angular/core';
import { VideoService } from '../video.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private videoService: VideoService, private router: Router) {}

  login() {
    console.log('Entered password:', this.password); // Debugging line
    if (this.password === 'jas') {
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/video-app']); // Correct route path
    } else {
      this.errorMessage = 'Incorrect password. Please try again.';
    }
  }

}
