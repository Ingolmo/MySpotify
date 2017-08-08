import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service'; 

import { ArtistService } from '../services/artist.service'; 
import { AlbumService } from '../services/album.service'; 

import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';


@Component({
	selector: 'album-add',
	templateUrl: '../views/album-add.html',
	providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertMessage;

	constructor(
		private _route:ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _albumService: AlbumService
	){
		this.titulo = 'Create new album';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('','',null,'','');
	}

	ngOnInit(){
		console.log('album.component.ts cargado');
	}

	onSubmit(){
		this._route.params.forEach((params: Params) => {
			let artist_id = params['id'];
			this.album.artist = artist_id;

			this._albumService.addAlbum(this.token, this.album).subscribe(
				response =>{
					if(!response.album){
						this.alertMessage = 'Server error';
					}else{
						this.alertMessage = 'Album created successfully';
						this.album = response.album;
						this._router.navigate(['/edit-album', response.album._id]);
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
		});
		
	}
}