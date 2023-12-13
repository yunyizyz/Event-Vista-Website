import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {  
  isSearch = true;

  SearchClick() {
    this.isSearch = true;
  }

  FavoriteClick() {
    this.isSearch = false;
  }
}

 