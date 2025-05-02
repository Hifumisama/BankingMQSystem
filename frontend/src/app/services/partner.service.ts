import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPartner } from '@shared/interfaces/partner.interface';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private apiUrl = 'http://localhost:3000/api/partners';

  constructor(private http: HttpClient) {}

  getAllPartners(): Observable<IPartner[]> {
    return this.http.get<IPartner[]>(this.apiUrl);
  }

  getPartnerById(id: string): Observable<IPartner> {
    return this.http.get<IPartner>(`${this.apiUrl}/${id}`);
  }

  createPartner(partner: Omit<IPartner, 'id' | 'createdAt'>): Observable<IPartner> {
    return this.http.post<IPartner>(this.apiUrl, partner);
  }

  deletePartner(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 