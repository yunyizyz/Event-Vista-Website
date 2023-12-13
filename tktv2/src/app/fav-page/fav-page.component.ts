import { Component } from '@angular/core';

@Component({
  selector: 'app-fav-page',
  templateUrl: './fav-page.component.html',
  styleUrls: ['./fav-page.component.css']
})
export class FavPageComponent {
  favEvents: any[] = [];
  isTrue: boolean=false;
  showfavtable: boolean=true;

  constructor() {

  if (localStorage.getItem('favEvents') !== null) {
    this.favEvents = JSON.parse(localStorage.getItem('favEvents')!);
    this.showfavtable=true
  } else {
    this.showfavtable=false
  }

  if (this.favEvents.length === 0) {
    this.showfavtable = false;
  }
  
  }
  

DeleteFav(event: any) {

  if (localStorage.getItem('favEvents') !== null) {

    let favEvents = JSON.parse(localStorage.getItem('favEvents')!);
    favEvents = favEvents.filter( (e: { name: string, date: string }) =>  e.name !== event.name || e.date !== event.date);
    localStorage.setItem('favEvents', JSON.stringify(favEvents));

    this.favEvents = favEvents;

    if (favEvents.length === 0) {
      this.showfavtable = false;
    }
  } 
  
  alert('Removed from favorites!');

}

}

