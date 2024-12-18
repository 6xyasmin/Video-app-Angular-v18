import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { VideoService } from './video.service';

@Injectable({
  providedIn: 'root',
})
export class VideoGuard implements CanActivate {
  constructor(private videoService: VideoService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.videoService.getIsLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
