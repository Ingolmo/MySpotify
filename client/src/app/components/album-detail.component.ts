import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service'; 
import { AlbumService } from '../services/album.service'; 
import { SongService } from '../services/song.service'; 
import { Album } from '../models/album'
import { Song } from '../models/song'

import { GLOBAL } from '../services/global';

@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [UserService, , AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public album: Album;
	public songs: Song[];
	public confirmado;

	constructor(
		private _route:ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('album-detail.component.ts cargado');
		// Call the API method to Get Album from ID
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
						
						//Display Artist's Songs.
						this._songService.getSongs(this.token, response.album._id).subscribe(
							response => {
								if(!response.songs){
									this.alertMessage = 'There no songs to display here...';
								}else{
									this.songs = response.songs;
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

	onCancelSong(){
		this.confirmado = null;
	}

	onDeleteSong(id){
		this._songService.deleteSong(this.token, id).subscribe(
			response => {
				if(!response.song){
					alert('Server error');
				}

				this.getAlbum();
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

	startPlayer(song){
		let song_player = JSON.stringify(song);
		let file_path = this.url + 'get-file-song/' + song.file;
		let image_path = this.url + 'get-image-album/' + song.album.image;

		localStorage.setItem('sound_song', song_player);
		document.getElementById("mp3-source").setAttribute("src",file_path);
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();

		document.getElementById('play-song-title').innerHTML = song.name;
		document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
		document.getElementById('play-image-album').setAttribute('src', image_path);
	}
}