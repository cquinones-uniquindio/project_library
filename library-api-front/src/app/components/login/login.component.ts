import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title:string = 'Por favor Inicia';
  user: User = new User();
  errores: string[];

  constructor(private userService: UserService, private router: Router) { }

  titulo:string = "Inicie sesión";

  ngOnInit() {
  }
  login(){
    
    this.userService.loginUser(this.user.email, this.user.password)
    .subscribe(
      json => {
        this.router.navigate(['/books']);
        console.log(json)
        localStorage.setItem('sesion', JSON.stringify(json));
        // swal.fire('Libro Devuelto', `${json.mensaje}: ${json.libro.name}`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
    window.location.replace("http://localhost:4200/books");
  }

}
