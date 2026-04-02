import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-article-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './article-view.component.html'
})
export class AdminArticleViewComponent {
  // Mock data for Admin Article View
  article = {
    id: 1,
    title: 'تطور العمارة في الأندلس عبر العصور',
    author: 'د. أحمد المنصور',
    date: '24 أكتوبر 2023',
    status: 'pending',
    category: 'تاريخ فني، معماري',
    tags: ['عمارة إسلامية', 'الأندلس', 'قرطبة'],
    views: '12.4k',
    content: `
      <p>اكتسبت العمارة الأندلسية طابعاً مميزاً يعكس التمازج الحضاري بين المشرق الإسلامي والتراث المحلي لشبه الجزيرة الأيبيرية. وقد تجلى ذلك في العديد من الصروح التي لا تزال شاهدة على العظمة المعمارية حتى اليوم.</p>
      <br>
      <h3>المراحل الأساسية لتطور العمارة</h3>
      <ul>
        <li><strong>عصر الإمارة والخلافة:</strong> برز الجامع الكبير بقرطبة كنموذج أولي متأثر بعمارة الجامع الأموي بدمشق مع إضافات مميزة كالأقواس المزدوجة التي سمحت بزيادة الارتفاع وإضفاء خفة بصرية...</li>
        <li><strong>عصر ملوك الطوائف:</strong> تميز ببناء القصور المحصنة (القصبات) التي جمعت بين الوظيفة العسكرية والجمالية، مثل قصر الجعفرية في سرقسطة...</li>
        <li><strong>عصر الموحدين والمرابطين:</strong> اتسم بالبساطة والضخامة واستخدام الزخارف الجصية بشكل واسع، ومن أبرز معالمه مئذنة الخيرالدة في إشبيلية...</li>
        <li><strong>عصر مملكة غرناطة:</strong> وصل فيه الفن الأندلسي ذروة رقته وتفاصيله المذهلة، كما هو واضح بجلاء في قصر الحمراء، بأفنيته وزخارفه الجصية...</li>
      </ul>
      <br>
      <p>تميزت العمارة الأندلسية بعدة عناصر فريدة، منها: استخدام العقود (الأقواس) بأشكال متنوعة (حدوة الفرس، المفصص، والمتقاطع)، الاهتمام بالزخارف الهندسية والنباتية (الأرابيسك)، واستخدام الفسيفساء والمقرنصات.</p>
    `,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5Hm_QMOAAjUq68FfsmSksMDq5rA9YXGdu_zMftj1n9SWshR46Q8SuaEUFMoFhEMZolsCbzhADepGLSdZRH5XQ1Z9CxA6IbLtaZ_hZij09HcbjJ54i-J-V5-s0lljF_g54iUbrYunsEtEcNPosop5775-5DkH4tuEVsAlV1oLuf_ZvBe98cOy5DDe9kLt0eggJPrMZVSz18s6YrO9_t_-nxIAIIaWvyEj7tI-Bb2uxUln_gytgFKXENhqmuX1jCelY7xkYsSaV9ImF' // reusing image from editor
  };

  changeStatus(newStatus: 'published' | 'draft' | 'pending' | 'rejected') {
    this.article.status = newStatus;
  }
}
