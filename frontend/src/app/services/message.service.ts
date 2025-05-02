import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMessage } from '@shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) {}

  getAllMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.apiUrl);
  }

  getMessageById(id: string): Observable<IMessage> {
    return this.http.get<IMessage>(`${this.apiUrl}/${id}`);
  }

  sendMessage(content: string, partnerId: string): Observable<IMessage> {
    return this.http.post<IMessage>(`${this.apiUrl}/send`, { content, partnerId });
  }

  receiveMessage(): Observable<IMessage | null> {
    return this.http.get<IMessage | null>(`${this.apiUrl}/receive`);
  }

  getMessagesByPartner(partnerId: string): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(`${this.apiUrl}/partner/${partnerId}`);
  }
} 