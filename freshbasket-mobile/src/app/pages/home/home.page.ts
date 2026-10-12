import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Vegetable } from '../../models/vegetable.model';
import { VegetableApiService } from '../../services/vegetable-api.service';
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule, IonicModule, CurrencyPipe],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  vegetables: Vegetable[] = [];
  search = '';
  loading = true;
  error = '';
  notice = '';
  private searchTimer: ReturnType<typeof setTimeout> | undefined;
  readonly Number = Number;

  constructor(public api: VegetableApiService, private cart: CartService) {}
  ngOnInit(): void { this.loadProducts(); }

  loadProducts(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.loading = true;
    this.searchTimer = setTimeout(() => {
      this.api.getVegetables(this.search.trim()).subscribe({
        next: response => {
          this.vegetables = response.data.filter(item => item.is_available && item.stock_quantity > 0);
          this.loading = false;
          this.error = '';
        },
        error: () => {
          this.loading = false;
          this.error = 'Cannot connect to the market server. Check the API address and make sure your backend is running.';
        }
      });
    }, 180);
  }

  addToCart(vegetable: Vegetable): void {
    this.cart.add(vegetable);
    this.notice = `${vegetable.name} added to your basket`;
    setTimeout(() => this.notice = '', 2200);
  }
}
