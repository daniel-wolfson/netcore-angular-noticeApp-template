import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Notice, CreateNoticeRequest } from '../models/notice.model';
import { environment } from '../../environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  private readonly apiUrl = `${environment.apiUrl}/api/notices`;
  private noticesSubject = new BehaviorSubject<Notice[]>([]);
  public notices$ = this.noticesSubject.asObservable();

  async getNotices(): Promise<Notice[]> {
    try {
      const response = await axios.get<Notice[]>(this.apiUrl);
      this.noticesSubject.next(response.data);
      return response.data;
    } catch (error) {
      throw this.handleAxiosError(error);
    }
  }

  async getNotice(id: number): Promise<Notice> {
    try {
      const response = await axios.get<Notice>(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleAxiosError(error);
    }
  }

  async addNotice(notice: CreateNoticeRequest): Promise<Notice> {
    try {
      const response = await axios.post<Notice>(this.apiUrl, notice);
      await this.refreshNotices();
      return response.data;
    } catch (error) {
      throw this.handleAxiosError(error);
    }
  }

  async updateNotice(id: string, notice: CreateNoticeRequest): Promise<Notice> {
    try {
      const response = await axios.put<Notice>(`${this.apiUrl}/${id}`, notice);
      await this.refreshNotices();
      return response.data;
    } catch (error) {
      throw this.handleAxiosError(error);
    }
  }

  async deleteNotice(id: string): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/${id}`);
      await this.refreshNotices();
    } catch (error) {
      throw this.handleAxiosError(error);
    }
  }

  private async refreshNotices(): Promise<void> {
    await this.getNotices();
  }

  private handleAxiosError(error: any): Error {
    let errorMessage = 'An unknown error occurred';

    if (error.response) {
      errorMessage = `Server Error: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'Network Error: No response received';
    } else {
      errorMessage = `Request Error: ${error.message}`;
    }

    console.error('API Error:', errorMessage);
    return new Error(errorMessage);
  }
}
