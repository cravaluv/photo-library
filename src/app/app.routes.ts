import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then(c => c.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/photos/photos.component').then(c => c.PhotosComponent),
      },
      {
        path: 'favorites',
        loadComponent: () => import('./features/favorites/favorites.component').then(c => c.FavoritesComponent),
      },
      {
        path: 'photos/:id',
        loadComponent: () => import('./features/photo-details/photo-details.component').then(c => c.PhotoDetailsComponent),
      },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then(c => c.NotFoundComponent),
      },
    ],
  },
];
