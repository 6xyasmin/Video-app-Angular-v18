import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';

interface Video {
  source: string;
  name: string;
  dateAdded: string;
  date: string;
  duration: string;
  selected: boolean;

}

@Component({
  selector: 'app-video-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-app.component.html',
  styleUrls: ['./video-app.component.css']
})
export class VideoAppComponent {
  videos: Video[] = [
    { source: '/39.mp4', name: 'Video 1', date: '2024-12-12', dateAdded: '2024-12-12', duration: 'Loading...', selected: false },
    { source: '/VID20241202103024.mp4', name: 'Video 2', date: '2024-12-11', dateAdded: '2024-12-11', duration: 'Loading...', selected: false },
    { source: '/VID20241206174746.mp4', name: 'Video 3', date: '2024-12-10', dateAdded: '2024-12-10', duration: 'Loading...', selected: false },
    { source: '/VID20241207212807.mp4', name: 'Video 4', date: '2024-12-10', dateAdded: '2024-12-10', duration: 'Loading...', selected: false }
  ];


  archive: Video[] = [];  // Archive for stored videos
  isEditing = false;
  showOptions = false;
  currentSort = 'By Name';
  isVideoEditing = false;

  showRenameModal = false;
  selectedVideo: Video | null = null;
  newVideoName = '';


  ngOnInit() {
    this.loadVideoNames();
    this.loadSortPreference();

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }


  toggleBodyScroll(disable: boolean) {
    if (disable) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  @HostListener('document:click', ['$event'])
  onBodyClick(event: MouseEvent) {
    const dropdown = document.querySelector('.options-dropdown');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.showOptions = false;  // Close the dropdown
    }
  }

  loadVideoNames() {
    const savedNames: Record<string, string> = JSON.parse(localStorage.getItem('videoNames') || '{}');
    this.videos.forEach(video => {
      if (savedNames[video.source]) {
        video.name = savedNames[video.source];
      }
    });
  }


  saveVideoNames() {
    const videoNames: Record<string, string> = this.videos.reduce((acc: Record<string, string>, video) => {
      acc[video.source] = video.name;
      return acc;
    }, {});
    localStorage.setItem('videoNames', JSON.stringify(videoNames));
  }
  loadVideos() {
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) {
      this.videos = JSON.parse(savedVideos);
    }
  }
  saveVideos() {
    localStorage.setItem('videos', JSON.stringify(this.videos));
  }

  loadSortPreference() {
    const savedSort = localStorage.getItem('currentSort');
    if (savedSort) {
      this.currentSort = savedSort;
      // Apply the saved sorting to the list
      if (this.currentSort === 'By Name') {
        this.sortByName();
      } else if (this.currentSort === 'By Date Added') {
        this.sortByDate();
      } else if (this.currentSort === 'By Duration') {
        this.sortByDuration();
      }
    }
  }
  applySort(sort: string) {
    this.currentSort = sort;
    this.saveSortPreference(sort);

    if (sort === 'By Name') {
      this.sortByName();
    } else if (sort === 'By Date Added') {
      this.sortByDate();
    } else if (sort === 'By Duration') {
      this.sortByDuration();
    }
  }
  sortByName() {
    this.videos.sort((a, b) => a.name.localeCompare(b.name));
    this.saveSortPreference('By Name');
    this.saveVideos();
  }

  sortByDate() {
    this.videos.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    this.saveSortPreference('By Date Added');
    this.saveVideos();
  }

  sortByDuration() {
    this.videos.sort((a, b) => {
      const durationA = this.convertDurationToSeconds(a.duration);
      const durationB = this.convertDurationToSeconds(b.duration);
      return durationA - durationB;
    });
    this.saveSortPreference('By Duration');
    this.saveVideos();
  }


  saveSortPreference(sort: string) {
    localStorage.setItem('currentSort', sort);
  }



  renameAction() {
    const selectedVideos = this.videos.filter(video => video.selected);
    if (selectedVideos.length === 1) {
      this.selectedVideo = selectedVideos[0];
      this.newVideoName = this.selectedVideo.name;
      this.showRenameModal = true;
      this.toggleBodyScroll(true); // Disable scrolling
    }
  }

  saveRename() {
    if (this.selectedVideo) {
      this.selectedVideo.name = this.newVideoName.trim();
      this.saveVideoNames();
      this.cancelRename();
    }
  }

  cancelRename() {
    this.showRenameModal = false;
    this.selectedVideo = null;
    this.newVideoName = '';
    this.toggleBodyScroll(false); // Enable scrolling
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.videos.forEach(video => {
      video.selected = isChecked;
    });
  }

  selectAllVideos(event: any) {
    const isSelected = event.target.checked;
    this.videos.forEach(video => video.selected = isSelected);
  }

  isAllSelected(): boolean {
    return this.videos.every(video => video.selected);
  }

  convertDurationToSeconds(duration: string): number {
    const [minutes, seconds] = duration.split(':').map(num => parseInt(num, 10));
    return minutes * 60 + seconds;
  }

  getVideoName(source: string): string {
    const filename = source.split('/').pop();
    return filename ? filename.replace('.mp4', '') : 'Unknown';
  }

  updateVideoDuration(video: any, videoElement: HTMLVideoElement) {
    video.duration = this.formatDuration(videoElement.duration);
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  editAction() {
    this.isEditing = !this.isEditing;
    console.log('isEditing:', this.isEditing);
  }

  Action() {
    this.isEditing = !this.isEditing;
  }

  closeEditMode() {
    this.isEditing = false;
  }

  isTrimMode = false; // Tracks if the trim mode is active

  @HostListener('document:fullscreenchange')
  onFullscreenChange() {
    const videoPlayer = document.querySelector('video') as HTMLVideoElement;
    if (document.fullscreenElement) {
      // Show controls when entering fullscreen
      if (videoPlayer) {
        videoPlayer.controls = true;
      }
    } else {
      // Stop video and hide controls when exiting fullscreen
      if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.controls = false;
      }
    }
  }

  toggleFullScreen(videoPlayer: HTMLVideoElement) {
    if (this.isEditing) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
      }
    }
  }
  anyVideoSelected(): boolean {
    return this.videos.some(video => video.selected);
  }

  updateButtonState() {
    this.anyVideoSelected();
  }

  shareAction() {
    const selectedVideos = this.videos.filter(video => video.selected);
    if (selectedVideos.length === 0) return;

    if (navigator.share) {
      navigator.share({
        title: 'Share Videos',
        text: `Check out these videos!`,
        url: window.location.href,
      });
    } else {
      alert('Share options: Facebook, Twitter, or copy link.');
    }
  }

  selectedVideosCount(): number {
    return this.videos.filter(video => video.selected).length;
  }

  detailsAction() {
    const selectedVideo = this.videos.find(video => video.selected);
    if (selectedVideo) {
      Swal.fire({
        title: 'Video Details',
        html: `
          <p><strong>Name:</strong> ${selectedVideo.name}</p>
          <p><strong>Format:</strong> MP4</p>
          <p><strong>Size:</strong> 6.40 MB</p>
          <p><strong>Resolution:</strong> 1920 x 1080 pixels</p>
          <p><strong>Duration:</strong> ${selectedVideo.duration}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Close',
      });
    } else {
      Swal.fire({
        title: 'No Video Selected',
        text: 'Please select a video to view details.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }


  confirmRename() {
    if (this.selectedVideo) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save this new name?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed && this.selectedVideo) {
          this.selectedVideo.name = this.newVideoName.trim();
          this.saveVideoNames();
          this.cancelRename();
          this.toggleBodyScroll(false);
          // Hide footer and deselect videos
          this.isEditing = false;
          this.videos.forEach(video => (video.selected = false));

          Swal.fire({
            title: 'Saved!',
            text: 'The video name has been updated.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    }
  }
  constructor(private router: Router) {
    this.loadVideoNames();
    this.loadSortPreference();
  }

  logoutAction() {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('isLoggedIn');
        this.router.navigate(['/login']);
      }
    });
  }

  deleteAction() {
    // Get selected videos
    const selectedVideos = this.videos.filter(video => video.selected);

    if (selectedVideos.length === 0) {
      Swal.fire({
        title: 'No Video Selected',
        text: 'Please select a video to delete.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Show confirmation alert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete the selected video(s). This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove selected videos
        this.videos = this.videos.filter(video => !video.selected);

        // Save updated videos to localStorage
        this.saveVideos();

        Swal.fire({
          title: 'Deleted!',
          text: 'The video(s) have been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    });
  }

}
