import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { OrderService } from '../../../services/order.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { Order } from '../../../types/order.types';
import { formatCurrency } from '../../../utils/currency.util';
import { formatDate } from '../../../utils/date.util';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private snackbar = inject(MatSnackBar);
  private title = inject(Title);
  readonly i18n = inject(I18nService);

  order = signal<Order | null>(null);
  loading = signal(true);
  cancelling = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.orderService.getOrder(p['id']).subscribe({
        next: (res) => {
          this.order.set(res.data);
          this.title.setTitle(`Order ${res.data?.order_number} – Tan Patisserie`);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
  }

  cancelOrder(): void {
    if (!confirm(this.i18n.t('orderDetail.confirmCancel'))) return;
    this.cancelling.set(true);
    this.orderService.cancelOrder(this.order()!.id).subscribe({
      next: (res) => {
        this.order.set(res.data);
        this.snackbar.open(this.i18n.t('orderDetail.cancelSuccess'), this.i18n.t('orderDetail.close'), { duration: 3000 });
        this.cancelling.set(false);
      },
      error: (err) => {
        this.snackbar.open(
          err.message || this.i18n.t('orderDetail.cancelFailed'),
          this.i18n.t('orderDetail.close'),
          { duration: 3000 },
        );
        this.cancelling.set(false);
      },
    });
  }

  fmt(v: string | number): string { return formatCurrency(v); }
  fmtDate(d: string): string { return formatDate(d); }

  canCancel(): boolean {
    return this.order()?.status === 'pending' || this.order()?.status === 'waiting_payment';
  }

  statusColor(s: string): string {
    const map: Record<string, string> = {
      pending: '#f59e0b', waiting_payment: '#f59e0b', paid: '#3b82f6',
      processing: '#8b5cf6', shipped: '#06b6d4', completed: '#22c55e', cancelled: '#ef4444',
    };
    return map[s] || '#888';
  }
}
