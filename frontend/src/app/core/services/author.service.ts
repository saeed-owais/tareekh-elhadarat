import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

export interface Author {
  id: number;
  name: string;
  title: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private authors: Author[] = [
    {
      id: 1,
      name: 'د. يوسف المنصور',
      title: 'باحث في التاريخ',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVj_DozTyILm8MZhBlQWXbQWlwZCUPyyIjxriOlyA22-6x-_2BRtiD-bjUX-Dr20eGadUxnJrql9Ajlv4_aCRvVRjvis8iiHf82SguS21tE6hMRp3yuVcNeDph52XuHx0wrIHnXrSINxuQvBy4Vpf0wxhX2WrrhFaYoK-lJjg5_MvGdJd5KZ5cF6vyj3QE2tOdXds_dfJXnsPIdEDXU8leXPFV9sZBnKkdrLbe-TgFl0azKg78HBZ3uVIpVcGvT6m26pmyiEswsTvo'
    },
    {
      id: 2,
      name: 'أ. ليلى حسن',
      title: 'ناقدة أدبية',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa5aBGv-LuQ8WbC3U9b_rYrXlN_zc58-AugrNQPfLFqNxyxOjSkNzyGH67IkAcUiCQ58j-H0vSBj_FecDgaNJrF_a8oHUumx0BzCw1LFIJM-MrWd1yDqV0nbsMyEx1G91OYPbiJ3LuwM8leGqocKhTdDGHIQ4hTj-WYCUPVahNHmSBvP6S8ak9O3p-OUhLF2Lkc1UBBk-nnuhYRvBEMB2pvXvVcH1JxIZfzMUuilfuuB_ybQUlVHszviq85m_Qs6C9t_AHg33yb6Ro'
    },
    {
      id: 3,
      name: 'د. عمر القاسم',
      title: 'أستاذ الفلسفة',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB-pe36HLOnnLbeSNfuQzfB_AopPGvrBS_PM1uM0gqixajhqGZgnDPU_GgaBGvQjIqqAXnY4NC49HYKma3RBKrqGj7QIN-UuJq_7hwuuTQHuUALzqX-yVp1dMtBtOZzjdW4FtM-08sFPyBfPOc91D4xEhDb4XpHpCPVdg4wTlqc8WDvTRD5Gr34zxajCxlP61kNGvuYCCIUvfFJbK9x7NpvRDv7Sf46JJyKVlvICsdDmzdsrrnUI02b2EamOv4PKW5K5ScI410Fvw_'
    },
    {
      id: 4,
      name: 'أ. سارة الراشد',
      title: 'كاتبة ومترجمة',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh1tiODzShiLCR2M5i3b9xgd_xI6usH9D48EQ3DX-1w-g3Qnj9g7t7GMDAuovEQ0lEvX3eoDzRMlcJLP_pnPI0tBiRkKb9L4xGiM_V7HjqBB1dvS5fqAyPUEr2ghOLbGw06qGpQrNIYhY70EL61O8Nib93XoRTrlRT4rdg7IP5uQlvrTCVgdCT5VL6qayhwUsbF-t13oXtcbWjUg9ES8ppxnU07tjj-c6IW7FlNdZLl7GGfJGn3G55jjACfx9lxJgMAsemIfSo2EpS'
    }
  ];

  getAuthors(): Author[] {
    return this.authors;
  }

  getAuthorById(id: number): Author | undefined {
    return this.authors.find(a => a.id === id);
  }
}
