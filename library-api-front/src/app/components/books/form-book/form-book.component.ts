import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/model/book';
import { BookService } from 'src/app/services/book.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form-book',
  templateUrl: './form-book.component.html',
  styleUrls: ['./form-book.component.css']
})
export class FormBookComponent implements OnInit {

  book: Book = new Book();
  titulo: string = "Create Book";

  errores: string[];

  constructor(private bookService: BookService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loadBook();
  }

  loadBook(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];

      if (id) {
        this.bookService.getBook(id).subscribe((book) => this.book = book);
      }
    })
  }

  createBook(): void {

    this.book.state = true;

    this.bookService.create(this.book)
      .subscribe(
        book => {
          this.router.navigate(['/books']);
          swal.fire('Nuevo libro', `El libro ${this.book.name} ha sido creado con éxito`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        },
      );
  }

  update(): void {
    this.bookService.update(this.book)
      .subscribe(
        json => {
          console.log(json)
          this.router.navigate(['/books']);
          swal.fire('Libro Actualizado', `${json.mensaje}: ${json.libro.name}`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }

}