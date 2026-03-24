import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { Customer, Address, CreateAddressRequest } from '../../../types/customer.types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private auth = inject(AuthService);
  private snackbar = inject(MatSnackBar);
  private title = inject(Title);
  readonly i18n = inject(I18nService);

  customer = signal<Customer | null>(null);
  addresses = signal<Address[]>([]);
  loading = signal(true);
  saving = signal(false);
  showAddressForm = signal(false);

  profileForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
  });

  addressForm = this.fb.group({
    label: ['Home', Validators.required],
    recipient_name: ['', Validators.required],
    phone: ['', Validators.required],
    address_line1: ['', Validators.required],
    address_line2: [''],
    city: ['', Validators.required],
    province: ['', Validators.required],
    postal_code: ['', Validators.required],
    is_default: [false],
  });

  constructor() {
    effect(() => {
      this.title.setTitle(this.i18n.t('seo.profile.title'));
    });
  }

  ngOnInit(): void {
    this.customerService.getProfile().subscribe({
      next: (res) => {
        this.customer.set(res.data);
        this.profileForm.patchValue({
          first_name: res.data?.first_name,
          last_name: res.data?.last_name,
          phone: res.data?.phone,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.customerService.getAddresses().subscribe({
      next: (res) => this.addresses.set(res.data ?? []),
    });
  }

  get fullName(): string {
    const c = this.customer();
    if (!c) return '';
    return `${c.first_name} ${c.last_name}`.trim();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.saving.set(true);
    const { first_name, last_name, phone } = this.profileForm.value;
    this.customerService.updateProfile({ first_name: first_name!, last_name: last_name!, phone: phone || undefined }).subscribe({
      next: (res) => {
        this.customer.set(res.data);
        this.snackbar.open(this.i18n.t('profile.profileUpdated'), this.i18n.t('profile.close'), { duration: 2000 });
        this.saving.set(false);
      },
      error: (err) => {
        this.snackbar.open(
          err?.error?.error?.message || this.i18n.t('profile.updateFailed'),
          this.i18n.t('profile.close'),
          { duration: 3000 },
        );
        this.saving.set(false);
      },
    });
  }

  addAddress(): void {
    if (this.addressForm.invalid) { this.addressForm.markAllAsTouched(); return; }
    const val = this.addressForm.value;
    const req: CreateAddressRequest = {
      label: val.label!,
      recipient_name: val.recipient_name!,
      phone: val.phone!,
      address_line1: val.address_line1!,
      address_line2: val.address_line2 || undefined,
      city: val.city!,
      province: val.province!,
      postal_code: val.postal_code!,
      is_default: val.is_default ?? false,
    };
    this.customerService.createAddress(req).subscribe({
      next: (res) => {
        this.addresses.update(list => [...list, res.data]);
        this.showAddressForm.set(false);
        this.addressForm.reset({ label: 'Home', is_default: false });
        this.snackbar.open(this.i18n.t('profile.addressAdded'), this.i18n.t('profile.close'), { duration: 2000 });
      },
      error: (err) => {
        this.snackbar.open(
          err?.error?.error?.message || this.i18n.t('profile.addFailed'),
          this.i18n.t('profile.close'),
          { duration: 3000 },
        );
      },
    });
  }

  deleteAddress(id: string): void {
    this.customerService.deleteAddress(id).subscribe({
      next: () => this.addresses.update(list => list.filter(a => a.id !== id)),
    });
  }

  setDefault(id: string): void {
    this.customerService.setDefaultAddress(id).subscribe({
      next: () => this.customerService.getAddresses().subscribe({ next: (res) => this.addresses.set(res.data ?? []) }),
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
