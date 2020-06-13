import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/model/book';
import { Borrow } from 'src/app/model/borrow';
import { BorrowService } from 'src/app/services/borrow.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html'
})
export class BooksComponent implements OnInit {

  books: Book[];
  users: User[];
  borrows: Borrow[];
  errores: string[];
  user: User;

  borrow: Borrow = new Borrow();

  constructor(private bookService: BookService,
    private borrowService: BorrowService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    
    this.bookService.getBooks().pipe(
      tap(books => {
        console.log('ClientesComponent: tap 3');
        books.forEach(book => {
          console.log(book.name);
        });
      })
    ).subscribe(books => this.books = books);

    this.borrowService.getBorrows().pipe(
      tap(borrows => {
        console.log('ClientesComponent: tap 3');
        borrows.forEach(borrow => {
          console.log(borrow.book.id);
        });
      })
    ).subscribe(borrows => this.borrows = borrows);
  }

  delete(book: Book): void {
    swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${book.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar!'

    }).then((result) => {
      if (result.value) {

        this.bookService.delete(book.id).subscribe(
          () => {
            this.books = this.books.filter(cli => cli !== book)
            swal.fire(
              'Libro Eliminado!',
              `Libro ${book.name} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    });
    this.isLoged();
  }

  changeBookState(book: Book, state:boolean){
    book.state = state;
    this.bookService.update(book)
    .subscribe(
      json => {
        this.router.navigate(['/books']);
        swal.fire('Libro Devuelto', `${json.mensaje}: ${json.libro.name}`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }
  createBorrow(book: Book): void {
    let x = localStorage.getItem("sesion");
    let user = JSON.parse(x);

    this.borrow.book = book;
    this.borrow.user = user;

    console.log(this.borrow);
    this.borrowService.create(this.borrow)
      .subscribe(
        borrow => {
          this.router.navigate(['/books']);
          swal.fire('Prestado', `El libro ${book.name} ha sido prestado con éxito`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        },
      );
      this.changeBookState(book, false);
  }
  isLoged(): boolean {
    let sesion = localStorage.getItem("sesion");
    if (sesion != null) {
      let userLoged = JSON.parse(localStorage.getItem('sesion'));

      this.user = userLoged.firstName;
      return true;
    }
    return false;
  }
  getByZone(){
    this.userService.getZones().pipe(
      tap(users => {
        console.log('ClientesComponent: tap 3');
        users.forEach(user => {
          swal.fire({
            icon: 'info',
            title: 'Books by zone',
            text: `Zona ${user.zone} cantidad ${user.totalZone}`
          })
        });
      })
    ).subscribe(users => this.users = users);
    
    
  }
}

