import { Component  } from '@angular/core';

@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.css']
})
export class NoAccessComponent  {
  private audio = new Audio('./assets/audios/pornhub-Intro-128-kbps.mp3');

  private audioPlayed = false; // Flag to control playback and prevent multiple triggers

  constructor() {
    this.audio.load();
  }
  playAudio(): void {
    if (!this.audioPlayed) {
      this.audio.play().catch(error => {
        console.error('Error al reproducir audio:', error);
      });
      this.audioPlayed = true; // Set the flag to true after attempting to play the audio
    }
  }
}
