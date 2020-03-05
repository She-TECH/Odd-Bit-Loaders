import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from "@angular/common";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers : [Location,{provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class LoginComponent implements OnInit {

  username= null;
  password= null;
  isLoginSuccess = false;
  badCredentials = false;
  
  constructor(private router: Router, private location:Location) {
    console.log("external url : ",location.prepareExternalUrl(location.path()));
  }

  checkCredentials()
  {
      if(this.username == 'admin' && this.password == 'admin')
      {
        console.log("login successful")
        this.isLoginSuccess = true;
        this.router.navigate(['/plantSelection',this.username])
      }
      else{
        this.badCredentials = true;
      }
  }

  ngOnInit() {
  }

}
