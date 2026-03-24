import { Injectable, inject, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { StorageService } from '../services/storage.service';
import { id } from './translations/id';
import { en } from './translations/en';

export type Lang = 'id' | 'en';

type DeepRecord = { [key: string]: string | DeepRecord };

const STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private storage = inject(StorageService);
  private document = inject(DOCUMENT);
  private meta = inject(Meta);

  readonly lang = signal<Lang>('id');

  private readonly translations: Record<Lang, DeepRecord> = {
    id: id as unknown as DeepRecord,
    en: en as unknown as DeepRecord,
  };

  constructor() {
    // Always start in Indonesian on app load.
    this.lang.set('id');
    this.storage.set(STORAGE_KEY, 'id');

    effect(() => {
      const current = this.lang();
      this.document.documentElement.setAttribute('lang', current);
      this.meta.updateTag({
        property: 'og:locale',
        content: current === 'id' ? 'id_ID' : 'en_US',
      });
    });
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    this.storage.set(STORAGE_KEY, lang);
  }

  toggle(): void {
    this.setLang(this.lang() === 'id' ? 'en' : 'id');
  }

  /** Resolve a dot-notation key against the active translations. */
  t(key: string): string {
    const parts = key.split('.');
    let node: string | DeepRecord = this.translations[this.lang()];
    for (const part of parts) {
      if (typeof node !== 'object' || node === null) return key;
      node = node[part];
    }
    return typeof node === 'string' ? node : key;
  }
}
