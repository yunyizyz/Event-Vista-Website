import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
    constructor(
    public dialogRef: MatDialogRef<MapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    get venueLat(): number {
    return parseFloat(this.data.venue_lat);
    }

    get venueLng(): number {
    return parseFloat(this.data.venue_lng);
    }

    closeMap(): void {
    this.dialogRef.close();
    }

    mapOptions: google.maps.MapOptions = {
    center: { lat: this.venueLat, lng: this.venueLng },
    zoom : 14
    }

    marker = {
        position: { lat: this.venueLat, lng: this.venueLng },
    }
}