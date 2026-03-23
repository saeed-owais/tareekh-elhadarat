import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [
    {
      id: 1,
      title: 'فلسفة الحرفة في العصر الرقمي: استعادة المعنى',
      content: 'مقال تفصيلي عن فلسفة الحرفة في العصر الرقمي...',
      excerpt: 'كيف يمكن استعادة المعنى والحرفية في ظل الثورة الرقمية التي نعيشها اليوم.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACPRZ9fApQxZLggAWFDuWdIJgqrOMNi9sX5KjHSryiEVOYJ3hUkxRNMK4Aa9puI9is71mYzAWUKRhGZaEkYfXJ6ggSMIAD5u1van0tTGGdnowpa1ZQtlaZ7Ci7czmhyX_Mg2lxYWHpkvuCaSQYkapc_LlxNgdm303JCq_TasKX3CmY2jSuN3NoiW-huyZXFBpTXCfP6gDmmYDGH_UeAHG3Huy_B8zRrN5pSUedJv-XZf2YqpLxaqGMeKY8MqJv4FewQMZRoBJWWWPA',
      status: 'published',
      createdAt: new Date('2024-05-15'),
      categoryId: 3,
      categoryName: 'فلسفة',
      createdBy: 1,
      authorName: 'د. عمر القاسم',
      readTime: '٨ دقائق قراءة'
    },
    {
      id: 2,
      title: 'بين الحقيقة والخيال: تدوين التاريخ في الأندلس',
      content: 'مقال تفصيلي عن تدوين التاريخ في الأندلس...',
      excerpt: 'رحلة عبر المخطوطات والوثائق التاريخية لفهم كيف تم تدوين تاريخ الأندلس.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvTOcb-4WoMNK3FNHOWAcTbvAFvAD0hiv1psKJfVJwybTcPE53lT5uI4ykosZhyRTIspUWKuhLGxv5Z9Cs6mps1oc44soP13Ya5kISixiw8_iuWR74l-ZiTu5vTztHb4eiQEIlO7ub5EY4AdtEcsFQwSEnwkEjld2rTDx1QuKRBZpqRUoyNc3ziDBSh9759mJ_3sF0LQYe0tiPbQp9XIs4czw-w-bS0Wir1NOEfQZ4J__rQnpI-WbTNij60X-9ZG3tM53Krumer9Sk',
      status: 'published',
      createdAt: new Date('2024-05-12'),
      categoryId: 2,
      categoryName: 'تاريخ',
      createdBy: 1,
      authorName: 'د. يوسف المنصور',
      readTime: '١٢ دقيقة قراءة'
    },
    {
      id: 3,
      title: 'مجالس الأدب في العواصم العربية: ذاكرة الحوار',
      content: 'مقال تفصيلي عن مجالس الأدب في العواصم العربية...',
      excerpt: 'استكشاف تاريخ المجالس الأدبية في العواصم العربية ودورها في إثراء الثقافة.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKRzkjPE9Aa-O8S8G4O93mMJ6EWDq7GGhlK16BDgkglA9Jf9ohWLiD27FiI15QakRI2kKzxX-1kRd6M9_jTQ0wo1RtH6whXEMJuCkne87RfpMDeebo63iIL66vaZaxXY3o3oXw6K5nd--ZEyD3H95zaQXU_O1ib9l5Y7vJGbi5nv5k6zkdWETfluxuPBvhLIyZ-KJJsFLF17hfCt-VgBGqD9GWO6Lss3rfVdyLFbWdpahbR-ifnaa1WrzqXAHbsOuJeGlrWGShubr',
      status: 'published',
      createdAt: new Date('2024-05-08'),
      categoryId: 4,
      categoryName: 'أدب',
      createdBy: 2,
      authorName: 'أ. ليلى حسن',
      readTime: '٦ دقائق قراءة'
    },
    {
      id: 4,
      title: 'الذكاء الاصطناعي: هل يهدد الهوية الثقافية؟',
      content: 'مقال تفصيلي عن تأثير الذكاء الاصطناعي على الهوية الثقافية...',
      excerpt: 'نقاش معمّق حول تأثير تقنيات الذكاء الاصطناعي على الهوية الثقافية العربية.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhLMRuyipwroCSKOsyhP0lA5dVBI4Dq9GPVGay4QTwlSpTCSq8_KbmReL0b0k-lskINCCJ_WVXMTkIwA-wwZDQDyMyx03lX4M3m2awmNqOiiIjIT0eaceEIeInzxSq5QCJsIdldPJyqyJX-yL4Ug82heunZRrc7oIEorvN6ChFbjUcCKtpggpNAYgZFQe51T_nDYWKYwzbxRW7cYyTAymM6YRuwu5eQXmDNVKgt4TfA_JX0VnbKm94gn1eg_EqWRI3fLnH6cbz_nMu',
      status: 'published',
      createdAt: new Date('2024-05-05'),
      categoryId: 5,
      categoryName: 'قضايا',
      createdBy: 4,
      authorName: 'أ. سارة الراشد',
      readTime: '١٠ دقائق قراءة'
    },
    {
      id: 5,
      title: 'عمارة الروح: تأملات في الفلسفة المعمارية الإسلامية',
      content: 'نظرة عميقة في الجذور الفكرية وكيف ساهمت في تشكيل الوعي المعاصر، مستكشفين الفراغ والضوء كعناصر روحية قبل أن تكون مادية.',
      excerpt: 'نظرة عميقة في الجذور الفكرية وكيف ساهمت في تشكيل الوعي المعاصر.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGaMizZifHeSWvvhp1FkJga8F5up4hBKUMUH-VMa1wk6VJ2-EjtLe984hkBoyUTPDlBJmFmIiKDDnTDZJy9g1H-AXNfVHaxnnK8DakMOoGV_ndmBUJAwEXYE-Y9d3mg2yNR1bi7EuJBKI640IIf4MhHyZYquCpEhMPOQUsnnb0pyypJUMi9JlX80vL1wBnbOCYQduWkgFmiZIJUjMDuOImss_626cy6ug3PVaMqGyqNQawEdvbcOSlhYASY0fjDsNGn014eWTQrqG5',
      status: 'published',
      createdAt: new Date('2024-05-20'),
      categoryId: 1,
      categoryName: 'فكر',
      createdBy: 3,
      authorName: 'د. عمر القاسم',
      readTime: '١٥ دقيقة قراءة'
    }
  ];

  private popularPosts = [
    { id: 6, title: 'مفهوم الزمن في الفكر الصوفي القديم', views: '٢٤ ألف مشاهدة' },
    { id: 7, title: 'تجليات الحداثة في الشعر العربي المعاصر', views: '١٨ ألف مشاهدة' },
    { id: 8, title: 'سيكولوجية المدن: كيف تؤثر البيئة على الوعي', views: '١٥ ألف مشاهدة' },
    { id: 9, title: 'مستقبل اللغة العربية في ظل العولمة', views: '١٢ ألف مشاهدة' }
  ];

  getPosts(): Post[] {
    return this.posts;
  }

  getLatestPosts(): Post[] {
    return this.posts.filter(p => p.id !== 5).slice(0, 4);
  }

  getFeaturedPost(): Post {
    return this.posts.find(p => p.id === 5)!;
  }

  getPostById(id: number): Post | undefined {
    return this.posts.find(p => p.id === id);
  }

  getPopularPosts(): { id: number; title: string; views: string }[] {
    return this.popularPosts;
  }

  getPostsByCategory(categoryId: number): Post[] {
    return this.posts.filter(p => p.categoryId === categoryId);
  }
}
