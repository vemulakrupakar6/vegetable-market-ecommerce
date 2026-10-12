import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CartService } from '../../services/cart.service';
import { VegetableApiService } from '../../services/vegetable-api.service';
import { CheckoutResponse } from '../../models/vegetable.model';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [CommonModule, FormsModule, IonicModule, CurrencyPipe],
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CartPage {
  customer_name = '';
  phone = '';
  address = '';
  placing = false;
  error = '';
  success: CheckoutResponse | null = null;
  readonly Number = Number;

  constructor(public cart: CartService, public api: VegetableApiService) {}

  placeOrder(): void {
    if (!this.cart.items.length || this.placing) return;
    this.placing = true;
    this.error = '';
    this.api.checkout({
      customer_name: this.customer_name.trim(),
      phone: this.phone.trim(),
      address: this.address.trim(),
      items: this.cart.items.map(item => ({ id: item.vegetable.id, quantity: item.quantity }))
    }).subscribe({
      next: response => { this.success = response; this.cart.clear(); this.placing = false; },
      error: err => {
        this.error = err?.error?.message || 'Unable to place order. Please check stock and try again.';
        this.placing = false;
      }
    });
  }
}
