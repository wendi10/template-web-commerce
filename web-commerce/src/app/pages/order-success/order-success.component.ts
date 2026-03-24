import { Component, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss'],
})
export class OrderSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  readonly i18n = inject(I18nService);
  orderNumber = '';

  constructor() {
    effect(() => {
      this.title.setTitle(this.i18n.t('seo.orderSuccess.title'));
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => this.orderNumber = p['order'] || '');
  }
}
