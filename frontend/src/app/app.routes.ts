import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    data: { seoKey: 'home' },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        data: { seoKey: 'home' }
      },
      {
        path: 'articles',
        loadComponent: () => import('./pages/articles/articles.component').then(m => m.ArticlesComponent),
        data: { seoKey: 'articles' }
      },
      {
        path: 'articles/:id',
        loadComponent: () => import('./pages/article-detail/article-detail.component').then(m => m.ArticleDetailComponent),
        data: { seoKey: 'articleDetail' }
      },
      {
        path: 'books',
        loadComponent: () => import('./pages/books/books.component').then(m => m.BooksComponent),
        data: { seoKey: 'books' }
      },
      {
        path: 'books/:id',
        loadComponent: () => import('./pages/book-detail/book-detail.component').then(m => m.BookDetailComponent),
        data: { seoKey: 'bookDetail' }
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
        data: { seoKey: 'about' }
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
        data: { seoKey: 'contact' }
      },
      {
        path: 'write-with-us',
        loadComponent: () => import('./pages/write-with-us/write-with-us.component').then(m => m.WriteWithUsComponent),
        data: { seoKey: 'writeWithUs' }
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
        data: { seoKey: 'search' }
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        data: { seoKey: 'profile' },
        canActivate: [authGuard]
      },
      {
        path: 'terms',
        loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent),
        data: { seoKey: 'terms' }
      },
    ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
        data: { seoKey: 'login' },
        canActivate: [guestGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
        data: { seoKey: 'register' },
        canActivate: [guestGuard]
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        data: { seoKey: 'forgotPassword' },
        canActivate: [guestGuard]
      },
    ]
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        data: { seoKey: 'resetPassword' },
        canActivate: [guestGuard]
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { seoKey: 'dashboard' }
      },
      {
        path: 'approvals',
        loadComponent: () => import('./pages/admin/approvals/approvals.component').then(m => m.ApprovalsComponent),
        data: { seoKey: 'approvals' }
      },
      {
        path: 'articles',
        loadComponent: () => import('./pages/admin/articles-manage/articles-manage.component').then(m => m.ArticlesManageComponent),
        data: { seoKey: 'manageArticles' }
      },
      {
        path: 'articles/add',
        loadComponent: () => import('./pages/admin/article-add/article-add.component').then(m => m.AdminArticleAddComponent),
        data: { seoKey: 'articleAdd' }
      },
      {
        path: 'articles/edit/:id',
        loadComponent: () => import('./pages/admin/article-edit/article-edit.component').then(m => m.AdminArticleEditComponent),
        data: { seoKey: 'articleEdit' }
      },
      {
        path: 'articles/view/:id',
        loadComponent: () => import('./pages/admin/article-view/article-view.component').then(m => m.AdminArticleViewComponent),
        data: { seoKey: 'articleView' }
      },
      {
        path: 'categories-tags',
        loadComponent: () => import('./pages/admin/categories-tags/categories-tags.component').then(m => m.CategoriesTagsComponent),
        data: { seoKey: 'categoriesTags' }
      },
      {
        path: 'books',
        loadComponent: () => import('./pages/admin/books-manage/books-manage.component').then(m => m.BooksManageComponent),
        data: { seoKey: 'manageBooks' }
      },
      {
        path: 'books/add',
        loadComponent: () => import('./pages/admin/book-add/book-add.component').then(m => m.BookAddComponent),
        data: { seoKey: 'bookAdd' }
      },
      {
        path: 'comments',
        loadComponent: () => import('./pages/admin/comments-manage/comments-manage.component').then(m => m.CommentsManageComponent),
        data: { seoKey: 'manageComments' }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
  }
];
