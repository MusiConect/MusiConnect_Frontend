import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FollowService {
    private readonly apiUrl = `${environment.apiUrl}/follow`;

    constructor(private http: HttpClient) {}

    followUser(followerId: number, followedUserId: number): Observable<any> {
        return this.http.post<any>(this.apiUrl, {
            followerId,
            followedUserId,
            followedBandId: null
        });
    }

    unfollowUser(followerId: number, followedUserId: number): Observable<any> {
        return this.http.request<any>('delete', this.apiUrl, {
            body: {
                followerId,
                followedUserId,
                followedBandId: null
            }
        });
    }

    getFollowing(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${userId}/following`);
    }
}