import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class Auth {

  login({ email, password }: { email: string, password: string }): Observable<any> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((user: any) => user.email === email && user.password === password);
    if (user) {
      localStorage.setItem('token', 'dummy-jwt-token');
      return of(user);
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  signup(user: any): Observable<any> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((us: any) => us.email === user.email)) {
      return throwError(() => new Error('User already exists'));
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return of(user);
  }

  logout(): void {
  localStorage.removeItem('token');
}

isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

}
