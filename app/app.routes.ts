import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { VideoAppComponent } from './video-app/video-app.component';
import { VideoGuard } from './video.guard';
import { LoginComponent } from './login/login.component';
export const routes: Routes = [
  {
    path: 'video-app',
    component: VideoAppComponent,
    canActivate: [VideoGuard], // Apply the guard
  },
  {
    path: 'login',
    component: LoginComponent, // A simple login component
  },
  {
    path: '**',
    redirectTo: '/login', // Redirect to login if route is not found
  },
];
