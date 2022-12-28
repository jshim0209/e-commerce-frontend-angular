import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userId = localStorage.getItem("userId");

  constructor(
    private httpClient: HttpClient,
  ) { }

  getUserById(): Observable<any> {
    return this.httpClient.get<any>(url + '/users/' + this.userId);
  }
}
