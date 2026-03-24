import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title, Meta } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Product, ProductImage } from '../../types/product.types';
import { formatCurrency } from '../../utils/currency.util';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private auth = inject(AuthService);
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  private titleService = inject(Title);
  private meta = inject(Meta);
  readonly i18n = inject(I18nService);

  product = signal<Product | null>(null);
  selectedImage = signal<ProductImage | null>(null);
  loading = signal(true);
  quantity = 1;
  addingToCart = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.productService.getProductBySlug(slug).subscribe({
          next: (res) => {
            this.product.set(res.data);
            const primary = res.data?.images?.find(i => i.is_primary) ?? res.data?.images?.[0];
            this.selectedImage.set(primary ?? null);
            this.loading.set(false);
            this.titleService.setTitle(`${res.data?.name} – Tan Patisserie`);
            this.meta.updateTag({ name: 'description', content: res.data?.description?.slice(0, 160) });
          },
          error: () => this.loading.set(false),
        });
      }
    });
  }

  get price(): string {
    return this.product() ? formatCurrency(this.product()!.price) : '';
  }

  get inStock(): boolean {
    return (this.product()?.stock ?? 0) > 0;
  }

  selectImage(img: ProductImage): void {
    this.selectedImage.set(img);
  }

  addToCart(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/account/login']);
      return;
    }

    this.addingToCart.set(true);
    this.cartService.addToCart({ product_id: this.product()!.id, quantity: this.quantity }).subscribe({
      next: () => {
        this.snackbar.open(
          this.i18n.t('productCard.addedToCart'),
          this.i18n.t('productCard.viewCart'),
          { duration: 3000, panelClass: ['snackbar-success'] },
        ).onAction().subscribe(() => this.cartService.openCart());
        this.addingToCart.set(false);
      },
      error: (err) => {
        this.snackbar.open(
          err.message || this.i18n.t('productCard.addFailed'),
          this.i18n.t('productCard.close'),
          { duration: 3000 },
        );
        this.addingToCart.set(false);
      },
    });
  }
}
