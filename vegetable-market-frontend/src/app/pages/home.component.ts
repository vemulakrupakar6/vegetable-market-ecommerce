import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Vegetable } from '../models/vegetable.model';
import { VegetableApiService } from '../services/vegetable-api.service';
import { CartService } from '../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
          this.error = 'Check that the backend is running at http://localhost:3000 and that CORS allows http://localhost:4200.';
        }
      });
    }, 180);
  }

  addToCart(vegetable: Vegetable): void {
    this.cart.add(vegetable);
    this.notice = `${vegetable.name} added to your basket`;
    setTimeout(() => this.notice = '', 2200);
  }

  imageFailed(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.style.display = 'none';
  }
}
