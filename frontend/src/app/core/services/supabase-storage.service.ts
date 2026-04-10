import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseStorageService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  /**
   * Uploads a file to a Supabase Storage bucket and returns the public URL and file path.
   * @param bucket - The storage bucket name (e.g. 'books')
   * @param file - The File object to upload
   * @param folder - Optional subfolder path within the bucket
   * @returns Object with publicUrl and filePath (filePath is needed for deletion/rollback)
   */
  async uploadFile(bucket: string, file: File, folder?: string): Promise<{ publicUrl: string; filePath: string }> {
    // Generate a unique filename to avoid collisions
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = folder
      ? `${folder}/${timestamp}_${safeName}`
      : `${timestamp}_${safeName}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`فشل رفع الملف: ${error.message}`);
    }

    // Get the public URL
    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { publicUrl: urlData.publicUrl, filePath: data.path };
  }

  /**
   * Deletes a file from a Supabase Storage bucket.
   * @param bucket - The storage bucket name
   * @param filePath - The full path of the file within the bucket
   */
  async deleteFile(bucket: string, filePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`فشل حذف الملف: ${error.message}`);
    }
  }
}
