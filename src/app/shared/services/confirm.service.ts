import { Injectable } from '@angular/core';

/** Wrapper de confirmação: isola `window.confirm` para facilitar testes e futura troca por um diálogo. */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  confirm(message: string): boolean {
    return globalThis.confirm(message);
  }
}
