import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _user: any;

  constructor(public api: ApiService) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    var credentials = {
      Username: accountInfo.email,
      Password: accountInfo.password
    }
    let seq = this.api.post('auth/login', credentials);

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.token != '') {
        this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo);

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(data) {
    this._user = data.response.user;
    localStorage.setItem('currentUser', JSON.stringify(this._user));
    localStorage.setItem('token', data.token);
  }
}
