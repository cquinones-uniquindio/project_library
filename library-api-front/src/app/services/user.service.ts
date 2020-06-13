import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlEndPoint: string = "http://localhost:8080/api";

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient, private router: Router) { }

  private isNotAuthorized(e):boolean{
    if(e.status==401 || e.status==403){
      this.router.navigate(['/login'])
      return true;
    }
    return false;
  }
  /**
   * Modificado
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.urlEndPoint).pipe(
      map(response => response as User[])
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(this.isNotAuthorized(e)){
          return throwError(e);
        }
        this.router.navigate(['/users'])
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.urlEndPoint}/get_user?email=${email}&password=${password}`).pipe(
      catchError(e => {
        this.router.navigate(['/books']);
        console.error(e.error.mensaje);
        Swal.fire('Error al Iniciar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  create(user: User): Observable<any> {
    return this.http.post<any>(this.urlEndPoint + "/users", user, { headers: this.httpHeaders }).pipe(
      catchError(e => {

        if(this.isNotAuthorized(e)){
          return throwError(e);
        }
        if (e.status == 400) {
          return throwError(e);
        }
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      }
      )
    );
  }

  update(user: User): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${user.id}`, user, { headers: this.httpHeaders }).pipe(
      catchError(
        e => {
          if(this.isNotAuthorized(e)){
            return throwError(e);
          }
          if (e.status == 400) {
            return throwError(e);
          }
          console.log(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        }
      )
    );
  }
  delete(id: number): Observable<any> {

    console.log("el id: " + id)
    return this.http.delete<any>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(
        e => {
          if(this.isNotAuthorized(e)){
            return throwError(e);
          }
          console.log(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        }
      )
    );
  }

  getZones(): Observable<User[]> {
    return this.http.get(this.urlEndPoint+"/get_zones").pipe(
      tap(response => {
        let users = response as User[];
        console.log('BookService: tap 1');

        users.forEach(book => {
        });
      }),
      map(response => {
        let users = response as User[];
        return users.map(user => {
          
          return user;
        });
      }
      ),
      tap(response => {
        console.log('BookService: tap 2');
        response.forEach(book => {
        });
      })
    );
  }
}

