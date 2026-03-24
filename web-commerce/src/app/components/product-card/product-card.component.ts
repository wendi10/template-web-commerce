import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../types/product.types';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { formatCurrency } from '../../utils/currency.util';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addedToCart = new EventEmitter<void>();

  private cart = inject(CartService);
  private auth = inject(AuthService);
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  private i18n = inject(I18nService);

  get primaryImage(): string {
    const primary = this.product.images?.find(img => img.is_primary);
    return primary?.url ?? this.product.images?.[0]?.url ?? 'assets/placeholder.jpg';
  }

  get formattedPrice(): string {
    return formatCurrency(this.product.price);
  }

  get inStock(): boolean {
    return this.product.stock > 0;
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/account/login']);
      return;
    }

    this.cart.addToCart({ product_id: this.product.id, quantity: 1 }).subscribe({
      next: () => {
        this.snackbar.open(
          this.i18n.t('productCard.addedToCart'),
          this.i18n.t('productCard.viewCart'),
          { duration: 3000 },
        );
        this.addedToCart.emit();
      },
      error: (err) => {
        this.snackbar.open(
          err.message || this.i18n.t('productCard.addFailed'),
          this.i18n.t('productCard.close'),
          { duration: 3000 },
        );
      },
    });
  }
}
