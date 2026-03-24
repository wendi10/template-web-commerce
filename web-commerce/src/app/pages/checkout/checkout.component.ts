import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { CustomerService } from '../../services/customer.service';
import { PromoService } from '../../services/promo.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CartSummary } from '../../types/cart.types';
import { Address } from '../../types/customer.types';
import { formatCurrency } from '../../utils/currency.util';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatRadioModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private customerService = inject(CustomerService);
  private promoService = inject(PromoService);
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  private title = inject(Title);
  readonly i18n = inject(I18nService);

  cart = signal<CartSummary | null>(null);
  addresses = signal<Address[]>([]);
  selectedAddressId = signal('');
  promoDiscount = signal(0);
  loading = signal(false);
  promoLoading = signal(false);

  form = this.fb.group({
    address_id: ['', Validators.required],
    payment_method: ['virtual_account', Validators.required],
    notes: [''],
    promo_code: [''],
  });

  constructor() {
    effect(() => {
      this.title.setTitle(this.i18n.t('seo.checkout.title'));
    });
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe({ next: (res) => this.cart.set(res.data) });
    this.customerService.getAddresses().subscribe({ next: (res) => {
      this.addresses.set(res.data ?? []);
      const def = res.data?.find(a => a.is_default);
      if (def) this.form.patchValue({ address_id: def.id });
    }});
  }

  applyPromo(): void {
    const code = this.form.get('promo_code')?.value;
    if (!code) return;

    this.promoLoading.set(true);
    this.promoService.validatePromo({ code, sub_total: +(this.cart()?.sub_total ?? 0) }).subscribe({
      next: (res) => {
        if (res.data?.is_valid) {
          this.promoDiscount.set(+(res.data.discount_amount));
          this.snackbar.open(`Promo applied! Save ${this.fmt(res.data.discount_amount)}`, this.i18n.t('login.close'), { duration: 3000 });
        } else {
          this.snackbar.open(res.data?.message || 'Invalid promo code', this.i18n.t('login.close'), { duration: 3000 });
        }
        this.promoLoading.set(false);
      },
      error: (err) => {
        this.snackbar.open(err?.error?.error?.message || 'Invalid promo code', this.i18n.t('login.close'), { duration: 3000 });
        this.promoLoading.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);

    const { address_id, payment_method, notes, promo_code } = this.form.value;

    this.orderService.createOrder({ address_id: address_id!, notes: notes || '', promo_code: promo_code || '' }).subscribe({
      next: (orderRes) => {
        this.paymentService.createPayment({
          order_id: orderRes.data.id,
          payment_method: payment_method!,
          provider: 'doku',
        }).subscribe({
          next: (payRes) => {
            this.loading.set(false);
            if (payRes.data.payment_url) {
              window.location.href = payRes.data.payment_url;
            } else {
              this.router.navigate(['/order-success'], { queryParams: { order: orderRes.data.order_number } });
            }
          },
          error: (err) => {
            this.snackbar.open(err?.error?.error?.message || 'Payment error', this.i18n.t('login.close'), { duration: 3000 });
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        this.snackbar.open(err?.error?.error?.message || 'Order error', this.i18n.t('login.close'), { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  fmt(v: string | number): string { return formatCurrency(v); }

  get total(): number {
    return +(this.cart()?.sub_total ?? 0) - this.promoDiscount();
  }
}
