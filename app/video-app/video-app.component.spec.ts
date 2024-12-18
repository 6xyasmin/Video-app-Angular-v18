import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAppComponent } from './video-app.component';

describe('VideoAppComponent', () => {
  let component: VideoAppComponent;
  let fixture: ComponentFixture<VideoAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
