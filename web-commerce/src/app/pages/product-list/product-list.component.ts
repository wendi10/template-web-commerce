import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Title, Meta } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Product, Category, ProductListFilter } from '../../types/product.types';
import { PaginationMeta } from '../../types/api.types';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatPaginatorModule,
    ProductCardComponent, TranslatePipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);
  private meta = inject(Meta);
  readonly i18n = inject(I18nService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  pagination = signal<PaginationMeta | null>(null);
  total = signal(0);
  loading = signal(true);

  filter: ProductListFilter = { page: 1, limit: 12, sort_by: 'created_at', sort_order: 'desc' };
  search = '';
  selectedCategory = '';

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(value => {
        this.filter.search = value || undefined;
        this.filter.page = 1;
        this.load();
      });

    effect(() => {
      this.titleService.setTitle(this.i18n.t('seo.products.title'));
      this.meta.updateTag({ name: 'description', content: this.i18n.t('seo.products.description') });
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.filter.category_id = params['category'];
      }
      this.load();
    });

    this.productService.getCategories().subscribe({ next: (res) => this.categories.set(res.data ?? []) });
  }

  load(): void {
    this.loading.set(true);
    this.productService.getProducts(this.filter).subscribe({
      next: (res) => {
        this.products.set(res.data ?? []);
        this.pagination.set(res.meta ?? null);
        this.total.set(res.meta?.total ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(value: string): void {
    this.searchSubject.next(value);
  }

  onCategoryChange(categoryId: string): void {
    this.filter.category_id = categoryId || undefined;
    this.filter.page = 1;
    this.router.navigate([], { queryParams: categoryId ? { category: categoryId } : {}, replaceUrl: true });
    this.load();
  }

  onSortChange(sort: string): void {
    const [by, order] = sort.split(':');
    this.filter.sort_by = by;
    this.filter.sort_order = order;
    this.filter.page = 1;
    this.load();
  }

  onPageChange(e: PageEvent): void {
    this.filter.page = e.pageIndex + 1;
    this.filter.limit = e.pageSize;
    this.load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
