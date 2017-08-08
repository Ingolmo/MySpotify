import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service'; 
import { ArtistService } from '../services/artist.service'; 
import { AlbumService } from '../services/album.service'; 
import { Album } from '../models/album'

import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-detail',
	templateUrl: '../views/artist-detail.html',
	providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit{
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public albums: Album[];
	public confirmado;

	constructor(
		private _route:ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _albumService: AlbumService
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('artist-detail.component.ts cargado');
		// Call the API method to Get Artist from ID
		this.getArtist();
	}

	getArtist(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._artistService.getArtist(this.token, id).subscribe(
				response =>{
					this.artist = response.artist;

					if(!response.artist){
						this._router.navigate(['/']);
					}else{
						this.artist = response.artist;
						
						//Display Artist's Albums.
						this._albumService.getAlbums(this.token, response.artist._id).subscribe(
							response => {
								if(!response.albums){
									this.alertMessage = 'There no albums to display here...';
								}else{
									this.albums = response.albums;
								}
							},
							error => {
								var errorMessage = <any>error;

						  		if(errorMessage != null){
						  			var body = JSON.parse(error._body);
						  			//this.alertMessage = body.message;
						  		
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
			  			//this.alertMessage = body.message;
			  		
			  			console.log(error);
			  		}
				}
			);
		});
	}

	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onCancelAlbum(){
		this.confirmado = null;
	}

	onDeleteAlbum(id){
		this._albumService.deleteAlbum(this.token, id).subscribe(
			response => {
				if(!response.album){
					alert('Server error');
				}

				this.getArtist();
			},
			error => {
				var errorMessage = <any>error;

		  		if(errorMessage != null){
		  			var body = JSON.parse(error._body);
		  			//this.alertMessage = body.message;
		  		
		  			console.log(error);
		  		}
			}
		);
	}	
}