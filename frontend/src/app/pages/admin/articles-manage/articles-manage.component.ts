import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-articles-manage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './articles-manage.component.html',
})
export class ArticlesManageComponent {
  confirmDeleteId = signal<number | null>(null);

  articles = signal([
    {
      id: 1,
      title: 'أسرار الهيروغليفية في عصر الدولة الحديثة',
      date: '12 أكتوبر 2023',
      category: 'حضارات قديمة',
      author: 'د. سمير الأنصاري',
      views: '12.4k',
      status: 'published',
      isPremium: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5Hm_QMOAAjUq68FfsmSksMDq5rA9YXGdu_zMftj1n9SWshR46Q8SuaEUFMoFhEMZolsCbzhADepGLSdZRH5XQ1Z9CxA6IbLtaZ_hZij09HcbjJ54i-J-V5-s0lljF_g54iUbrYunsEtEcNPosop5775-5DkH4tuEVsAlV1oLuf_ZvBe98cOy5DDe9kLt0eggJPrMZVSz18s6YrO9_t_-nxIAIIaWvyEj7tI-Bb2uxUln_gytgFKXENhqmuX1jCelY7xkYsSaV9ImF'
    },
    {
      id: 2,
      title: 'تجارة التوابل وتأثيرها على العمارة الأندلسية',
      date: '05 أكتوبر 2023',
      category: 'العصور الوسطى',
      author: 'أ. ليلى محمود',
      views: '8.2k',
      status: 'draft',
      isPremium: false,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChnTs4c3DS_Has8LAaer-HiCbC2pXhJPSbIrsFiEAZ6fNQx8P8gkLN7E9UAP2RIWysNGIUjJWpX7NaebdH2U7HIYLy-7-RifBOCNnERXYTavM01EgxM9MsQ2hAGjGFGv_et0aqOKmVixnpYGymN4B-4JZ_9yTHltDhVqxZn-P0Z6IjSgfPz8-gU96fZIXY8ociDFjjEuzpVcaWt_5_O3nmOM-_7p6uSddQN21fQON_l3R01znBiJDnqToZH0NtiVQPSE2so6Azw4at'
    },
    {
      id: 3,
      title: 'فلسفة التناظر في الفن الإسلامي المبكر',
      date: '28 سبتمبر 2023',
      category: 'تاريخ الفن',
      author: 'د. يوسف خالد',
      views: '21.9k',
      status: 'published',
      isPremium: false,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYgZjuRW1CPSNTYrt3c2x2slPhXpRZaJtUsfLvMpfrnP_79Z-7bUZOISaya0qoaFmChdvYdh3M6-oOaILWij-OZfs8eF5TBcRqUryjGhGrlj_w_dVKhgc_k_fuTxA8jJg_BLhiXOt_S-uNSjKqpO3B6_DMJthYKX2FJAFwOZYN2IejaLyy-3-2rYyPchKycW_e9ESf-lOohfxEMFJGn5pEZoyocMaaK9X5dQmXMI8aKTu88yx7Abz82gY__7Qo8YqpqGNHjhUhjWR9'
    },
    {
      id: 4,
      title: 'طريق الحرير: رحلة الصمت عبر القفار',
      date: '15 سبتمبر 2023',
      category: 'حضارات قديمة',
      author: 'أ. مريم صالح',
      views: '15.5k',
      status: 'published',
      isPremium: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADyxhOfnBkCsCAAgB9ljwCxK4khZNFzTxp4_Tg62kbjQqcqWhZfPu8VgFjCkRkUnfTgQutSuDwLYnGZwF3BBbrSIu_R16vlFz-saZoBC0NLlq9at6P_ql4lJK500yUwqVmam6fOV6rcBiIUmsxN3tuLFMVfcBkq2zwZWsqxUpp4uaON39L0xP-F2dV6YGNFRoFc1iiJDpCUWQuvXo9YXUrEk7FYgFoDGsJ5xfEIu1L1ByWww94CRIhTXXkhVQLF2CLJVM_74qjpyrN'
    }
  ]);

  toggleDelete(id: number, event: Event) {
    event.stopPropagation();
    if (this.confirmDeleteId() === id) {
      this.confirmDeleteId.set(null);
    } else {
      this.confirmDeleteId.set(id);
    }
  }

  confirmDelete(id: number, event: Event) {
    event.stopPropagation();
    this.articles.update(articles => articles.filter(a => a.id !== id));
    this.confirmDeleteId.set(null);
  }
}
