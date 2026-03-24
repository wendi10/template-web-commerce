import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * Pure-false pipe that returns the translation for a dot-notation key.
 * Re-evaluates on every change-detection cycle so language switches
 * are reflected immediately without extra wiring in each component.
 *
 * Usage:  {{ 'nav.home' | translate }}
 */
@Pipe({ name: 'translate', pure: false, standalone: true })
export class TranslatePipe implements PipeTransform {
  private i18n = inject(I18nService);

  transform(key: string): string {
    return this.i18n.t(key);
  }
}
