import { Component, OnInit } from '@angular/core';
import { UserService} from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'Musify';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor (
    private _route:ActivatedRoute,
    private _router: Router,
  	private _userService : UserService
  ){
  	this.user = new User('', '', '', '', '', 'ROLE_USER', '');
  	this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;

  }

  ngOnInit(){
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
  }

  public onSubmit(){
  	console.log(this.user);

  	// Get Data from identified user
  	this._userService.signup(this.user).subscribe(
  		response => {
  			let identity = response.user;
  			this.identity = identity;

  			if(!this.identity._id){
  				alert("El usuario no se ha identificado correctamente");
  			}else{
  				//Crear elemento en localstorage para tener al usuario en sesión
  				localStorage.setItem('identity', JSON.stringify(identity));

  				// Get token to be sent at each http request
			  	this._userService.signup(this.user, 'true').subscribe(
			  		response => {
			  			let token = response.token;
			  			this.token = token;

			  			if(this.token.length <= 0){
			  				alert("Token not generated.");
			  			}else{
			  				//Crear elemento en localstorage para tener token 
			  				localStorage.setItem('token', token);
			  				this.user = new User('', '', '', '', '', 'ROLE_USER', '');
			  			}
			  		},
			  		error => {
			  			var errorMessage = <any>error;

			  			if(errorMessage != null){
			  			 	var body = JSON.parse(error._body);
			  				this.errorMessage = body.message;
			  				console.log(error);
			  			}
			  		}
			  	);
  			}
  		},
  		error => {
  			var errorMessage = <any>error;

  			if(errorMessage != null){
  			 	var body = JSON.parse(error._body);
  				this.errorMessage = body.message;
  				console.log(error);
  			}
  		}
  	);
  }

  logout(){
  	localStorage.removeItem('identity');
  	localStorage.removeItem('token');
  	localStorage.clear();

  	this.identity = null;
  	this.token = null;

    this._router.navigate(['/']);
  }

  onSubmitRegister(){
  	//console.log(this.user_register);

  	this._userService.register(this.user_register).subscribe(
  		response => {
  			let user = response.user;
  			this.user_register = user;
  			console.log(user);
  			if(!user._id){
  				this.alertRegister = 'Error during register.';
  			}else{
  				this.alertRegister = 'Registered successfully. Log-in with ' + this.user_register.email;
  				this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
  			}
  		},
  		error => {
  			var errorMessage = <any>error;

  			if(errorMessage != null){
  			 	var body = JSON.parse(error._body);
  				this.alertRegister = body.message;
  				
  				console.log(error);
  			}
  		}
  	);
  }
}
