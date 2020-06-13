import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Borrow } from '../model/borrow';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  private urlEndPoint: string = 'http://localhost:8080/api';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  getBorrows(): Observable<Borrow[]> {
    return this.http.get(this.urlEndPoint+"/all_borrows").pipe(
      tap(response => {
        let borrows = response as Borrow[];
        console.log('borrowService: tap 1');
        borrows.forEach(borrow => {
          // console.log(borrow.name);
        });
      }),
      map(response => {
        let borrows = response as Borrow[];
        return borrows.map(borrow => {
          // borrow.name = borrow.name.toUpperCase();

          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');
          return borrow;
        });
      }
      ),
      tap(response => {
        console.log('borrowService: tap 2');
        response.forEach(borrow => {
          // console.log(borrow.name);
        });
      })
    );
  }

  create(borrow: Borrow): Observable<Borrow> {
    return this.http.post(this.urlEndPoint + "/borrows", borrow, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.borrow as Borrow),
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getborrow(id): Observable<Borrow> {
    return this.http.get<Borrow>(`${this.urlEndPoint}/borrows?borrow=${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/borrows']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(borrow: Borrow): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/borrows/${borrow.borrowId}`, borrow, { headers: this.httpHeaders }).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
      );
  }

  delete(id: number): Observable<Borrow> {
    return this.http.delete<Borrow>(`${this.urlEndPoint}/borrows/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}