import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { Book } from '../model/book';
import swal from 'sweetalert2';

@Injectable()
export class BookService {
  private urlEndPoint: string = 'http://localhost:8080/api';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  getBooks(): Observable<Book[]> {
    return this.http.get(this.urlEndPoint+"/all_books").pipe(
      tap(response => {
        let books = response as Book[];
        console.log('BookService: tap 1');
        books.forEach(book => {
          // console.log(book.name);
        });
      }),
      map(response => {
        let books = response as Book[];
        return books.map(book => {
          book.name = book.name.toUpperCase();
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');
          return book;
        });
      }
      ),
      tap(response => {
        console.log('BookService: tap 2');
        response.forEach(book => {
          // console.log(book.name);
        });
      })
    );
  }

  create(book: Book): Observable<Book> {
    return this.http.post(this.urlEndPoint + "/books", book, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.book as Book),
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

  getBook(id): Observable<Book> {
    return this.http.get<Book>(`${this.urlEndPoint}/books?book=${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/books']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(book: Book): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/books/${book.id}`, book, { headers: this.httpHeaders }).pipe(
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

  delete(id: number): Observable<Book> {
    return this.http.delete<Book>(`${this.urlEndPoint}/books/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}