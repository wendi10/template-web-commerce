import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { OrderService } from '../../../services/order.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { Order } from '../../../types/order.types';
import { PaginationMeta } from '../../../types/api.types';
import { formatCurrency } from '../../../utils/currency.util';
import { formatDateShort } from '../../../utils/date.util';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatPaginatorModule, TranslatePipe],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  private title = inject(Title);
  readonly i18n = inject(I18nService);

  orders = signal<Order[]>([]);
  paginationMeta = signal<PaginationMeta | null>(null);
  total = signal(0);
  loading = signal(true);
  page = 1;
  limit = 10;

  constructor() {
    effect(() => {
      this.title.setTitle(this.i18n.t('seo.orders.title'));
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.orderService.getMyOrders(this.page, this.limit).subscribe({
      next: (res) => {
        this.orders.set(res.data ?? []);
        this.paginationMeta.set(res.meta ?? null);
        this.total.set(res.meta?.total ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onPage(e: PageEvent): void {
    this.page = e.pageIndex + 1;
    this.limit = e.pageSize;
    this.load();
  }

  fmt(v: string | number): string { return formatCurrency(v); }
  fmtDate(d: string): string { return formatDateShort(d); }

  statusColor(s: string): string {
    const map: Record<string, string> = {
      pending: '#f59e0b', waiting_payment: '#f59e0b', paid: '#3b82f6',
      processing: '#8b5cf6', shipped: '#06b6d4', completed: '#22c55e', cancelled: '#ef4444',
    };
    return map[s] || '#888';
  }
}
