import { Component, inject, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);
  private title = inject(Title);
  readonly i18n = inject(I18nService);

  loading = false;
  hidePassword = true;

  form = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor() {
    effect(() => {
      this.title.setTitle(this.i18n.t('seo.register.title'));
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const { email, password, first_name, last_name, phone } = this.form.value;
    this.auth.register({
      email: email!,
      password: password!,
      first_name: first_name!,
      last_name: last_name!,
      phone: phone!,
    }).subscribe({
      next: () => {
        this.snackbar.open(this.i18n.t('register.welcomeMsg'), this.i18n.t('register.close'), { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.snackbar.open(
          err?.error?.error?.message || this.i18n.t('register.failedMsg'),
          this.i18n.t('register.close'),
          { duration: 3000 },
        );
        this.loading = false;
      },
    });
  }
}
