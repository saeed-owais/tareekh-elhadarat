import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'تاريخ الشعوب | منصة للوعي الحضاري المعاصر'
  },
  {
    path: 'articles',
    loadComponent: () => import('./pages/articles/articles.component').then(m => m.ArticlesComponent),
    title: 'المقالات | تاريخ الشعوب'
  },
  {
    path: 'articles/:id',
    loadComponent: () => import('./pages/article-detail/article-detail.component').then(m => m.ArticleDetailComponent),
    title: 'تفاصيل المقال | تاريخ الشعوب'
  },
  {
    path: 'books',
    loadComponent: () => import('./pages/books/books.component').then(m => m.BooksComponent),
    title: 'الكتب | تاريخ الشعوب'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'من نحن | تاريخ الشعوب'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'تواصل معنا | تاريخ الشعوب'
  },
  {
    path: 'write-with-us',
    loadComponent: () => import('./pages/write-with-us/write-with-us.component').then(m => m.WriteWithUsComponent),
    title: 'اكتب معنا | تاريخ الشعوب'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
