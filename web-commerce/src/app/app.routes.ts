import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent),
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard],
  },
  {
    path: 'order-success',
    loadComponent: () => import('./pages/order-success/order-success.component').then(m => m.OrderSuccessComponent),
  },
  {
    path: 'account',
    children: [
      { path: 'login', loadComponent: () => import('./pages/account/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/account/register/register.component').then(m => m.RegisterComponent) },
      {
        path: 'profile',
        loadComponent: () => import('./pages/account/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/account/order-history/order-history.component').then(m => m.OrderHistoryComponent),
        canActivate: [authGuard],
      },
      {
        path: 'orders/:id',
        loadComponent: () => import('./pages/account/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
        canActivate: [authGuard],
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
