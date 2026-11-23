import { Injectable, InjectionToken, inject } from '@angular/core';

/** Abstrai o `Storage` do navegador (facilita testes e ambientes sem localStorage). */
export const BROWSER_STORAGE = new InjectionToken<Storage | null>('BROWSER_STORAGE', {
  providedIn: 'root',
  factory: () => {
    try {
      return globalThis.localStorage ?? null;
    } catch {
      // Acesso pode lançar erro (modo privado, cookies bloqueados).
      return null;
    }
  },
});

/** Leitura/escrita de JSON tolerante a falhas. Nunca lança exceções. */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage = inject(BROWSER_STORAGE);

  read<T>(key: string): T | null {
    try {
      const raw = this.storage?.getItem(key);
      return raw == null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  }

  /** @returns `true` se gravou com sucesso (falha em cota cheia, por exemplo). */
  write(key: string, value: unknown): boolean {
    try {
      this.storage?.setItem(key, JSON.stringify(value));
      return this.storage !== null;
    } catch {
      return false;
    }
  }
}
