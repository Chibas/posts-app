import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

  isAuthenticated: boolean;

  authenticated = new EventEmitter();

  constructor(private http: Http) {
    this.isAuthenticated = false;
  }

  login(username: string, password: string) {
    return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password}))
      .map((response: Response) => {
        // login OK if token is present in the response
        let user = response.json();

        if (user && user.token) {
          // store user and token in LS to keep session between pages
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.isAuthenticated = true;
        this.authenticated.emit(this.isAuthenticated);
        return user;
      });
  }

  logout() {
    // remove user from LS
    localStorage.removeItem('currentUser');
    this.isAuthenticated = false;
    this.authenticated.emit(this.isAuthenticated);
  }

}
