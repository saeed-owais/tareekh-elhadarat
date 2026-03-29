import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({
    providedIn: 'root'
})
export class TagService {

    private baseUrl = 'http://modawanty.runasp.net/api/Tags';

    constructor(private http: HttpClient) { }

    // ================= GET ALL TAGS =================
    getTags(): Observable<Tag[]> {
        // return of([{
        //     id: 1,
        //     name: 'حضارات',
        //     isAvailable: true
        // }, {
        //     id: 2,
        //     name: 'تاريخ',
        //     isAvailable: true
        // }, {
        //     id: 3,
        //     name: 'ثقافة',
        //     isAvailable: true
        // }, {
        //     id: 4,
        //     name: 'فلسفة',
        //     isAvailable: true
        // }, {
        //     id: 5,
        //     name: 'أدب',
        //     isAvailable: true
        // }, {
        //     id: 6,
        //     name: 'فن',
        //     isAvailable: true
        // }, {
        //     id: 7,
        //     name: 'دين',
        //     isAvailable: true
        // }, {
        //     id: 8,
        //     name: 'سياسة',
        //     isAvailable: true
        // }, {
        //     id: 9,
        //     name: 'اقتصاد',
        //     isAvailable: true
        // }, {
        //     id: 10,
        //     name: 'اجتماع',
        //     isAvailable: true
        // }, {
        //     id: 11,
        //     name: 'جغرافيا',
        //     isAvailable: true
        // }, {
        //     id: 12,
        //     name: 'علوم',
        //     isAvailable: true
        // }, {
        //     id: 13,
        //     name: 'تكنولوجيا',
        //     isAvailable: true
        // }]);
        return this.http.get<Tag[]>(this.baseUrl).pipe(
            catchError(err => {
                return throwError(() => 'فشل تحميل الوسوم');
            })
        );
    }
}
