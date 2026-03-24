import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Banner } from '../../types/banner.types';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-banner-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './banner-carousel.component.html',
  styleUrls: ['./banner-carousel.component.scss'],
})
export class BannerCarouselComponent implements OnInit, OnDestroy {
  @Input() banners: Banner[] = [];

  currentIndex = signal(0);
  private interval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  prev(): void {
    this.currentIndex.update(i => (i - 1 + this.banners.length) % this.banners.length);
    this.resetAutoPlay();
  }

  next(): void {
    this.currentIndex.update(i => (i + 1) % this.banners.length);
    this.resetAutoPlay();
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
    this.resetAutoPlay();
  }

  private startAutoPlay(): void {
    if (this.banners.length > 1) {
      this.interval = setInterval(() => this.next(), 5000);
    }
  }

  private stopAutoPlay(): void {
    if (this.interval) clearInterval(this.interval);
  }

  private resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
