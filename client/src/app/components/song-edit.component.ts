import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service'; 

import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

import { SongService} from '../services/song.service';

import { UploadService } from '../services/upload.service'; 

@Component({
	selector: 'song-edit',
	templateUrl: '../views/song-add.html',
	providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit{
	public titulo: string;
	public song: Song;
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
		private _songService: SongService,
		private _uploadService: UploadService
	){
		this.titulo = 'Edit song';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(1,'','','','');
		this.is_edit = true;
	}

	ngOnInit(){
		console.log('song-edit.component.ts cargado');

		// Get the song to edit
		this.getSong();
	}

	getSong(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._songService.getSong(this.token, id).subscribe(
				response =>{
					if(!response.song){
						this._router.navigate(['/']);
					}else{
						this.song = response.song;
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

			console.log(this.song);

			this._songService.editSong(this.token, id, this.song).subscribe(
				response =>{
					if(!response.song){
						this.alertMessage = 'Server error';
					}else{
						this.alertMessage = 'Song updated successfully';
						
						if(!this.filesToUpload){
							this._router.navigate(['/album', response.song.album]);
						}else{
							// Upload audio file
							this._uploadService.makeFileRequest(this.url+'upload-file-song/'+id, [], this.filesToUpload, this.token, 'file').then(
								(result) =>{
									// exit & redirect
									this._router.navigate(['/album', response.song.album]);
								},
								(error) =>{
									console.log(error);
								}
							);
						}
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

	fileChangeEvent(fileImput: any){
		this.filesToUpload = <Array<File>>fileImput.target.files;
	}
}