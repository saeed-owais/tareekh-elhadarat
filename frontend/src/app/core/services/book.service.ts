import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private books: Book[] = [
    {
      id: 1,
      title: 'تاريخ العلم في الإسلام',
      description: 'دراسة شاملة لتاريخ العلوم في الحضارة الإسلامية وإسهاماتها.',
      fileUrl: '#',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhZowyeLsvSLYkb64Jp7_D3XSW3odBQ91bWgIFqxyWvqZWkgnrtI2pXQ0qz4RF7eyHGwRfkqUbLwN3SiY1n64du5rGIhd-sEHPqvxmUMdGu-8YYwapvK9N1HIpf9sHb_p8IJ4H4LLEz9p76wenMCQqQDWv9DTYcF63syosh4abqCt8fvORxvIhDmvwyQFxI-083lHwiu6HcnSLebdS_qlDikpUqZwAFK1adigVDIRRQDYp374jzbyDHzvv6pYjzMTE3bQb9Eh6yFad',
      status: 'available',
      createdAt: new Date('2024-01-15'),
      authorName: 'د. مصطفى العبادي'
    },
    {
      id: 2,
      title: 'سوسيولوجيا المدينة العربية',
      description: 'دراسة سوسيولوجية للمدينة العربية وتحولاتها عبر العصور.',
      fileUrl: '#',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4tBeRaMg5Jad8YR5hqajAXmm1bpjDO-nnTlNcVCRKuidIAlGgm7nzSc__H1CXtYtnsR05TJDlod8uN0cCUsL-i4KN_zIFCDQ8oaVz-2nZyu3jbqDZmjJHqup2UQ5PIQ0dXcM8URGU3pNXLO_eIZ_veMeAFwi5c-EIwFlMUAHo7vpdpT4KhdNv1JEd4mLYrcaqp1MZMDNZgamkH3GT3fnROCtYFnw3KwdzNZYen_bTCviUuUpJLDoUXDTjdNjdOqagmyus5RfmVjrv',
      status: 'available',
      createdAt: new Date('2024-02-20'),
      authorName: 'أ. د. خالد السامرائي'
    },
    {
      id: 3,
      title: 'منطق الجمال: دراسات فلسفية',
      description: 'دراسات فلسفية في مفهوم الجمال وتجلياته في الفكر العربي.',
      fileUrl: '#',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlp5qzxKHrdEw9ZCkJqh68lpyFP_et044J45lRxTNHGO6TSXuYPGCAlI_WFGddmToiE6qEiEqRUJMDqCa34nsjvtBI9fM6ehPsjq-UbkZn0BUKrfav5JSGzmu8-vdDkkRSZanrF-OZpC3jK_nWFJ-iUmlGP5P1UrS4tb6bkp-4qpL9SyzHXQdLvS9FoCYN9TM23wMzuGUj-2UWQkaqEJUgq8S246ynE5ujSVkHjNxuYBEzVD1Khiw-QGUU3hvk5MKButLfoXYQDXBs',
      status: 'available',
      createdAt: new Date('2024-03-10'),
      authorName: 'د. هند الشايع'
    },
    {
      id: 4,
      title: 'إعادة قراءة الحداثة',
      description: 'قراءة نقدية لمفهوم الحداثة وتأثيرها على الثقافة العربية.',
      fileUrl: '#',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF9csZsDQLmIXfYo9hvS83ssuzLEsZQcNQjxSWaCLbWlPfFV_Hzl7bNMCUIM57zsmVdH_1I5U8GzYtWjQ2eAJb6TP_hHcdrAIx27vr4r8tiQynxivpqApDT7GIAo5KWHtdTuW4MeORI0sY8DRBvQb2ldxF4FRU0R56Lphsiz-GgUEIjVNTv_ZDdrJKKzwitiPmNveFW36DC6AV9I_5rjHuzoEISn9p7frodpeYv6ZFPR26f3g2YyQPnjQxAAuRd3efoEMELKO7SThn',
      status: 'available',
      createdAt: new Date('2024-04-05'),
      authorName: 'د. فهد الغنام'
    }
  ];

  getBooks(): Book[] {
    return this.books;
  }

  getBookById(id: number): Book | undefined {
    return this.books.find(b => b.id === id);
  }
}
