import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service'; 
import { ArtistService } from '../services/artist.service'; 

import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-add',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public alertMessage;

	constructor(
		private _route:ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService
	){
		this.titulo = 'Add new Artist';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;

		this.artist = new Artist('','','');
	}

	ngOnInit(){
		console.log('artist-add.component.ts cargado');
		console.log(this.identity);
		// Get the list of artists
	}

	onSubmit(){
		console.log(this.artist);
		this._artistService.addArtist(this.token, this.artist).subscribe(
			response =>{
				if(!response.artist){
					this.alertMessage = 'Server error';
				}else{
					this.alertMessage = 'Artist created successfully';
					this.artist = response.artist;
					this._router.navigate(['/edit-artist', response.artist._id]);
				}
			},
			error =>{
				var errorMessage = <any>error;

			  	if(errorMessage != null){
			  		var body = JSON.parse(error._body);
			  		this.alertMessage = body.message;
			  		
			  		console.log(error);
			  	}
			}
		);
	}
}