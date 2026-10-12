import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { CartComponent } from './pages/cart.component';
import { AdminComponent } from './pages/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'FreshBasket | Vegetables' },
  { path: 'cart', component: CartComponent, title: 'Your Cart | FreshBasket' },
  { path: 'admin', component: AdminComponent, title: 'Admin | FreshBasket' },
  { path: '**', redirectTo: '' }
];
