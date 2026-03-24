import { delay, Observable, of } from "rxjs";
import { UserProfile } from "../models/user-profile.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  // بيانات وهمية (Mock Data)
  private mockUser: UserProfile = {
    firstName: 'إبراهيم',
    lastName: 'العامري',
    username: '@ibrahim_al_amiri',
    email: 'ibrahim.amiri@history.com',
    bio: 'باحث في تاريخ الحضارات العربية القديمة ومهتم بتوثيق التراث الثقافي لمنطقة الخليج العربي. أسعى من خلال هذا الملف إلى مشاركة قراءاتي وأبحاثي في علم الآثار والأنثروبولوجيا التاريخية.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa7MjvT3KBNJ22HUMyRSUI6jHx4sbfQKLJM93D_GftY7Ny7mRTAu33EDtAN_lUxIrqgiFFBi0QWsinZuaZeCj7hT82FAMoVW1pcqskDkPvlqgYyCOJ5gGWyf0TvJHqQ5xvc1N2OCybLNWTHHyqYeXsXjo6dX1M4fH7RYEjFo1vd76sPwFmOy5YBhlTdl3U8MY401hf8AxoBM5UHIWh3S3o7OsO7yX22oEpqhXw_deqB1F86lvEsR-34fikLkt-hQfSKa2ZMa1-1Tlx',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxLnAdYiP86wd8V7IBsLKEnHreL0PmtxkGH6SEXlz56DwJw29Pm10ahCmiboqe7NLVopRch4jwdhclwdLSB5kxzY7Urx9SCnn83_hJahJ7QzE_PGW4fcgQ189hiavLXJvNuPL9v71ol0BU41S70BCKQM2XuZbFFZdc4CLz3xAxGLMP4QmrbvMI0GaOaOGBHsFW0hHHH7Qw99U-QFFU2NwZi0CTX2uBoWK3t8a-a5BJTLUl-VWfQzj2vIVIbGLM9ULApYqOnYNUpbnX',
    joinDate: 'يونيو 2022'
  };

  // محاكاة جلب البيانات (كأنها تأتي من API)
  getUserProfile(): Observable<UserProfile> {
    // of() تقوم بتحويل البيانات العادية إلى Observable
    // delay(1500) تؤخر الرد لمدة ثانية ونصف لمحاكاة السيرفر
    return of(this.mockUser).pipe(delay(1500));
  }
}