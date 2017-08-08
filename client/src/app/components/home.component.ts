import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
	selector: 'home',
	templateUrl: '../views/home.html'
})

export class HomeComponent implements OnInit{
	public titulo: string;
	

	constructor(
		private _route:ActivatedRoute,
		private _router: Router,
	){
		this.titulo = 'Home';
	}

	ngOnInit(){
		console.log('home.component.ts cargado');

		// Get the list of artists
	}
}