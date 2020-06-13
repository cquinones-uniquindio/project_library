import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  title: string = 'Ingresa tus datos';
  user: User = new User();
  errores: string[];
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  createUser(): void {

    this.userService.create(this.user)
      .subscribe(
        user => {
          this.router.navigate(['/home']);
          swal.fire('Nuevo usuario', `El usuario ${this.user.firstName} ha sido creado con éxito`, 'success');

          localStorage.setItem('sesion', JSON.stringify(user.usuario))
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        },
      );


    this.delay(3000);
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => window.location.reload());
  }
}
