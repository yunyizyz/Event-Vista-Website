import { Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})

export class CardComponent implements OnInit {

  @Input() selectedEvent: any;

  attractions: any;
  name: any;
  noArtRecord: boolean = false;
  moreArtRecord: boolean = false;
  isTrue: boolean = false;
  artistData: any[] = [];
  venueData: any[] = [];
  favlist: any[] = [];
  isEventInFavEvents: boolean = false;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit() {
    this.attractions = this.selectedEvent._embedded.attractions;
    if (this.attractions) {
      this.noArtRecord = false;
      for (let i = 0; i < this.attractions.length; i++) {
        const artistName = this.attractions[i].name;      
        // const url = `http://localhost:3000/callsptf/${artistName}`;
        const url = `https://eventfinderyyz.wl.r.appspot.com/callsptf/${artistName}`;
        this.http.get(url).subscribe((data: any) => {
          this.artistData.push(data);
        }, (error) => {
          console.log(error);
          this.noArtRecord = true;
        });
      }
    } else {
      this.noArtRecord = true;
    }
  }

  ChangeColor() {
    this.isTrue = true;
    alert('Event added to favorites!');
  
    const eventData = {
      name: this.selectedEvent.name,
      date: this.selectedEvent.dates.start.localDate,
      venue: this.selectedEvent._embedded.venues[0].name,
      category: this.selectedEvent.classifications[0].segment.name,
      genre: this.selectedEvent.classifications[0].genre.name,
      subGenre: this.selectedEvent.classifications[0].subGenre.name
    };

    if (typeof(Storage) !== "undefined") {
      let favEvents = JSON.parse(localStorage.getItem('favEvents') || '[]');
      favEvents.push(eventData);
      localStorage.setItem('favEvents', JSON.stringify(favEvents));
      // localStorage.setItem('favButtonState', this.isTrue ? 'true' : 'false');
    }

  };

  checkEventInFavEvents(): boolean {
    const favEvents = JSON.parse(localStorage.getItem('favEvents') || '[]');
    const foundEvent = favEvents.find((event: any) => {
      return event.name === this.selectedEvent.name && event.date === this.selectedEvent.dates.start.localDate;
    });
    return foundEvent !== undefined;
  }



  shareOnTwitter() {
    const tweetText = `Check ${this.selectedEvent.name} on Ticketmaster: ${this.selectedEvent.url}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
  }
  
  shareOnFacebook() {
    const postUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.selectedEvent.url)}`;
    window.open(postUrl, '_blank');
  }

  @Output() backTable = new EventEmitter<void>();

  nowIndex = 0;

  // prevArtist() {
  //   this.nowIndex = Math.max(this.nowIndex - 1, 0);
  // }
  
  // nextArtist() {
  //   this.nowIndex = Math.min(this.nowIndex + 1, this.artistData.length - 1);
  // }

  prevArtist() {
    this.nowIndex = this.nowIndex === 0 ? this.artistData.length - 1 : this.nowIndex - 1;
  }
  
  nextArtist() {
    this.nowIndex = (this.nowIndex + 1) % this.artistData.length;
  }

  openMap(): void {
    const dialogRef = this.dialog.open(MapComponent, {
      height: '480px',
      width: '60%',
      position: {left: '20%', top: '-20px'},
      data: {
        venue_lat: this.selectedEvent._embedded.venues[0].location.latitude,
        venue_lng: this.selectedEvent._embedded.venues[0].location.longitude,
      },
      
    });
  

    dialogRef.afterClosed().subscribe(result => {
      console.log('The map dialog was closed');
    });

}



}
