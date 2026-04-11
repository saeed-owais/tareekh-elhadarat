import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  scrollProgress = signal<number>(0);

  updateProgress(progress: number): void {
    this.scrollProgress.set(progress);
  }

  resetProgress(): void {
    this.scrollProgress.set(0);
  }
}
