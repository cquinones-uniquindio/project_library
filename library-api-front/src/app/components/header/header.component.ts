import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title:string = "Book Store";
  isLoged:boolean = false;
  user:string;
  constructor() { }

  ngOnInit(): void {
    let sesion = localStorage.getItem("sesion");
    if(sesion != null){
      this.isLoged = true;
      let userLoged = JSON.parse(localStorage.getItem('sesion'));

      this.user = userLoged.firstName;
    }
  }

  logout():void{
    localStorage.removeItem('sesion');
    window.location.reload();
  }

  
}
