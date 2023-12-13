import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MainFormComponent } from './main-form/main-form.component';
import { FavPageComponent } from './fav-page/fav-page.component';
import { CardComponent } from './card/card.component';
import { MapComponent } from './map/map.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    MainFormComponent,
    FavPageComponent,
    CardComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    MatDialogModule,
    MatButtonToggleModule,
    NgCircleProgressModule.forRoot({
      radius: 45,
      outerStrokeWidth: 6,
      innerStrokeWidth: 3,
      outerStrokeColor: '#c0002d',
      innerStrokeColor: '#ffb5c6',
      titleColor : '#fafafa',
      animation: true,
      showUnits: false,
      showSubtitle: false,
      showTitle : true,
      titleFontSize: '18',
      animationDuration: 100,
    }),
    RouterModule.forRoot([
        { path: '', component: MainFormComponent },
        { path: 'fav-page', component: FavPageComponent },
    ])
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
