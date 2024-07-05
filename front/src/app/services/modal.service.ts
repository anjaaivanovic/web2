import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalVisibilityMap: Map<string, BehaviorSubject<boolean>> = new Map();

  getModalVisibility(modalId: string): Observable<boolean> {
    if (!this.modalVisibilityMap.has(modalId)) {
      this.modalVisibilityMap.set(modalId, new BehaviorSubject<boolean>(false));
    }
    return this.modalVisibilityMap.get(modalId)!.asObservable();
  }

  showModal(modalId: string) {
    if (!this.modalVisibilityMap.has(modalId)) {
      this.modalVisibilityMap.set(modalId, new BehaviorSubject<boolean>(true));
    } else {
      this.modalVisibilityMap.get(modalId)!.next(true);
    }
  }

  hideModal(modalId: string) {
    if (this.modalVisibilityMap.has(modalId)) {
      this.modalVisibilityMap.get(modalId)!.next(false);
    }
  }
}
