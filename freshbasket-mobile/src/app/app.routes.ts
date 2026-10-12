import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { CartPage } from './pages/cart/cart.page';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'FreshBasket' },
  { path: 'cart', component: CartPage, title: 'Your Basket' },
  { path: '**', redirectTo: '' }
];
