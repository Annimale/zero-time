import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone:true,
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.css'],
  imports:[TranslateModule],
})
export class NoAccessComponent  {
  private audio?: HTMLAudioElement;

  private audioPlayed = false; // Flag to control playback and prevent multiple triggers

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.audio = new Audio('./assets/audios/pornhub-Intro-128-kbps.mp3');
      this.audio.load();
    }
  }

  playAudio(): void {
    if (this.audio && !this.audioPlayed) {
      this.audio.play().catch(error => {
        console.error('Error al reproducir audio:', error);
      });
      this.audioPlayed = true; // Set the flag to true after attempting to play the audio
    }
  }
}
