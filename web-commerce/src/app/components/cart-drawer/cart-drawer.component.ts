import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CartSummary, CartItem } from '../../types/cart.types';
import { formatCurrency } from '../../utils/currency.util';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss'],
})
export class CartDrawerComponent {
  readonly cartService = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);

  cart = signal<CartSummary | null>(null);
  loading = signal(false);

  constructor() {
    effect(() => {
      const isOpen = this.cartService.isOpen();
      if (isOpen && this.auth.isLoggedIn()) {
        this.loadCart();
      }
    });
  }

  loadCart(): void {
    this.loading.set(true);
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  updateQty(item: CartItem, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      this.removeItem(item);
      return;
    }
    this.cartService.updateItem(item.id, { quantity: newQty }).subscribe({
      next: (res) => this.cart.set(res.data),
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.id).subscribe({
      next: (res) => this.cart.set(res.data),
    });
  }

  formatPrice(value: string | number): string {
    return formatCurrency(value);
  }

  checkout(): void {
    this.cartService.closeCart();
    this.router.navigate(['/checkout']);
  }
}
