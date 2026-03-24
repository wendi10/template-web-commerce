import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressBarModule, NavbarComponent, FooterComponent, CartDrawerComponent],
  template: `
    <!-- Global loading bar -->
    @if (loadingService.isLoading()) {
      <mat-progress-bar mode="indeterminate" class="global-progress"></mat-progress-bar>
    }

    <app-navbar />
    <main class="main-content">
      <router-outlet />
    </main>
    <app-footer />
    <app-cart-drawer />
  `,
  styles: [`
    :host { display: block; }

    .global-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
    }

    .main-content {
      min-height: calc(100vh - 72px);
    }
  `],
})
export class App {
  readonly loadingService = inject(LoadingService);
}
