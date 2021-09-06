import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private http: HttpClient) {}

  createNewThingWithFile(form: any, image: File): any {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('thing', JSON.stringify(form));
      formData.append('image', image, form.title);
      this.http.put('http://localhost:3000/api/stuff', formData).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
