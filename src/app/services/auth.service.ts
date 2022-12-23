import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl + '/auth';

  constructor(
    private httpClient: HttpClient
  ) { }

  login(email: string, password: string): Observable<any> {

    const authUrl = `${this.baseUrl}/auth/authenticate`;
    return this.httpClient.post<any>(
      authUrl,
      {
        email: email,
        password: password
      },
      { observe: 'response' }
    );
  }
}
