import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Vegetable } from '../models/vegetable.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  get count(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + Number(item.vegetable.price) * item.quantity, 0);
  }

  add(vegetable: Vegetable): void {
    if (!vegetable.is_available || vegetable.stock_quantity < 1) return;
    const items = [...this.items];
    const existing = items.find(item => item.vegetable.id === vegetable.id);
    if (existing) {
      if (existing.quantity < vegetable.stock_quantity) existing.quantity += 1;
    } else {
      items.push({ vegetable, quantity: 1 });
    }
    this.itemsSubject.next(items);
  }

  setQuantity(id: number, quantity: number): void {
    const item = this.items.find(entry => entry.vegetable.id === id);
    if (!item) return;
    if (quantity <= 0) {
      this.remove(id);
      return;
    }
    item.quantity = Math.min(quantity, item.vegetable.stock_quantity);
    this.itemsSubject.next([...this.items]);
  }

  remove(id: number): void {
    this.itemsSubject.next(this.items.filter(item => item.vegetable.id !== id));
  }

  clear(): void {
    this.itemsSubject.next([]);
  }
}
