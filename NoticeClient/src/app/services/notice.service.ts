import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Notice, CreateNoticeRequest } from '../models/notice.model';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private readonly apiUrl = 'https://localhost:5001/api/notices';
  private noticesSubject = new BehaviorSubject<Notice[]>([]);
  public notices$ = this.noticesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotices(): Observable<Notice[]> {
    return this.http.get<Notice[]>(this.apiUrl).pipe(
      tap(notices => this.noticesSubject.next(notices)),
      catchError(this.handleError)
    );
  }

  getNotice(id: number): Observable<Notice> {
    return this.http.get<Notice>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addNotice(notice: CreateNoticeRequest): Observable<Notice> {
    return this.http.post<Notice>(this.apiUrl, notice).pipe(
      tap(() => this.refreshNotices()),
      catchError(this.handleError)
    );
  }

  updateNotice(id: number, notice: CreateNoticeRequest): Observable<Notice> {
    return this.http.put<Notice>(`${this.apiUrl}/${id}`, notice).pipe(
      tap(() => this.refreshNotices()),
      catchError(this.handleError)
    );
  }

  deleteNotice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshNotices()),
      catchError(this.handleError)
    );
  }

  private refreshNotices(): void {
    this.getNotices().subscribe();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}