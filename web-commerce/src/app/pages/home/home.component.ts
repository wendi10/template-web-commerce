import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Title, Meta } from '@angular/platform-browser';
import { BannerCarouselComponent } from '../../components/banner-carousel/banner-carousel.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { BannerService } from '../../services/banner.service';
import { ProductService } from '../../services/product.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Banner } from '../../types/banner.types';
import { Product } from '../../types/product.types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, BannerCarouselComponent, ProductCardComponent, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private bannerService = inject(BannerService);
  private productService = inject(ProductService);
  private title = inject(Title);
  private meta = inject(Meta);
  readonly i18n = inject(I18nService);

  banners = signal<Banner[]>([]);
  featuredProducts = signal<Product[]>([]);
  loading = signal(true);

  constructor() {
    effect(() => {
      this.title.setTitle(this.i18n.t('seo.home.title'));
      this.meta.updateTag({ name: 'description', content: this.i18n.t('seo.home.description') });
    });
  }

  ngOnInit(): void {
    this.bannerService.getActiveBanners().subscribe({
      next: (res) => this.banners.set(res.data ?? []),
    });

    this.productService.getProducts({ limit: 8, sort_by: 'created_at', sort_order: 'desc' }).subscribe({
      next: (res) => {
        this.featuredProducts.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
