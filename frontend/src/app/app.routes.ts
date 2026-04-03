import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    title: 'تاريخ الشعوب | منصة للوعي الحضاري المعاصر',
    children: [
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
        path: 'search',
        loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
        title: 'نتائج البحث | تاريخ الشعوب'
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'الملف الشخصي | تاريخ الشعوب',
        canActivate: [authGuard]
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
        title: 'تسجيل الدخول | تاريخ الشعوب',
        canActivate: [guestGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
        title: 'حساب جديد | تاريخ الشعوب',
        canActivate: [guestGuard]
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        title: 'نسيت كلمة المرور | تاريخ الشعوب',
        canActivate: [guestGuard]
      }]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'نظرة عامة | لوحة التحكم'
      },
      {
        path: 'approvals',
        loadComponent: () => import('./pages/admin/approvals/approvals.component').then(m => m.ApprovalsComponent),
        title: 'مركز الموافقات | لوحة التحكم'
      },
      {
        path: 'articles',
        loadComponent: () => import('./pages/admin/articles-manage/articles-manage.component').then(m => m.ArticlesManageComponent),
        title: 'إدارة المقالات | لوحة التحكم'
      },
      {
        path: 'articles/add',
        loadComponent: () => import('./pages/admin/article-add/article-add.component').then(m => m.AdminArticleAddComponent),
        title: 'إضافة مقال جديد | لوحة التحكم'
      },
      {
        path: 'articles/edit/:id',
        loadComponent: () => import('./pages/admin/article-edit/article-edit.component').then(m => m.AdminArticleEditComponent),
        title: 'تعديل المقال | لوحة التحكم'
      },
      {
        path: 'articles/view/:id',
        loadComponent: () => import('./pages/admin/article-view/article-view.component').then(m => m.AdminArticleViewComponent),
        title: 'تفاصيل المقال | لوحة التحكم'
      },
      {
        path: 'categories-tags',
        loadComponent: () => import('./pages/admin/categories-tags/categories-tags.component').then(m => m.CategoriesTagsComponent),
        title: 'الفئات والوسوم | لوحة التحكم'
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
