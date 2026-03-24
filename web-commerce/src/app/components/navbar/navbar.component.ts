import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Category } from '../../types/product.types';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  readonly i18n = inject(I18nService);
  private productService = inject(ProductService);

  categories = signal<Category[]>([]);
  menuOpen = signal(false);

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (res) => this.categories.set(res.data ?? []),
    });

    if (this.auth.isLoggedIn()) {
      this.cart.getCart().subscribe();
    }
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
