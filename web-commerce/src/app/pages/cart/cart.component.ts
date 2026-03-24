import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CartSummary, CartItem } from '../../types/cart.types';
import { formatCurrency } from '../../utils/currency.util';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private title = inject(Title);
  readonly i18n = inject(I18nService);

  cart = signal<CartSummary | null>(null);
  loading = signal(true);

  constructor() {
    effect(() => {
      this.title.setTitle(this.i18n.t('seo.cart.title'));
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading.set(true);
    this.cartService.getCart().subscribe({
      next: (res) => { this.cart.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  updateQty(item: CartItem, delta: number): void {
    const qty = item.quantity + delta;
    if (qty < 1) { this.remove(item); return; }
    this.cartService.updateItem(item.id, { quantity: qty }).subscribe({
      next: (res) => this.cart.set(res.data),
    });
  }

  remove(item: CartItem): void {
    this.cartService.removeItem(item.id).subscribe({
      next: (res) => this.cart.set(res.data),
    });
  }

  fmt(v: string | number): string { return formatCurrency(v); }

  checkout(): void { this.router.navigate(['/checkout']); }
}
