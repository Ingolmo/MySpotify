import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service'; 
import { AlbumService } from '../services/album.service'; 
import { UploadService } from '../services/upload.service'; 

import { GLOBAL } from '../services/global';
import { Album } from '../models/album';


@Component({
	selector: 'album-edit',
	templateUrl: '../views/album-add.html',
	providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit{
	public titulo: string;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public is_edit;
	public filesToUpload: Array<File>;

	constructor(
		private _route:ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _uploadService: UploadService
	){
		this.titulo = 'Edit album';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('','',null,'','');
		this.is_edit = true;
	}

	ngOnInit(){
		console.log('album.component.ts cargado');
		// Get album
		this.getAlbum();
	}

	getAlbum(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._albumService.getAlbum(this.token, id).subscribe(
				response =>{
					if(!response.album){
						this._router.navigate(['/']);
					}else{
						this.album = response.album;
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

	onSubmit(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._albumService.editAlbum(this.token, id, this.album).subscribe(
				response => {
					if(!response.album){
						this.alertMessage = 'Server error 1';
					}else{
						this.alertMessage = 'Album updated successfully';
						
						// Upload picture
						if(!this.filesToUpload){
							//Redirect
						}else{
							this._uploadService.makeFileRequest(this.url+'upload-image-album/'+id, [], this.filesToUpload, this.token, 'image').then(
								(result) =>{
									// exit & redirect
								},
								(error) =>{
									console.log(error);
								}
							);
						}

						this._router.navigate(['/artist', response.album.artist]);							
					}
				},
				error => {
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

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

}