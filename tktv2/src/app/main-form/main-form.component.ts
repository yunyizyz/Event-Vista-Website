import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.css']
})
export class MainFormComponent implements OnInit {
  
  isLoading = false;
  showoptions = false;
  formSubmitted = false; 
  showTable = false;
  noRecord = false;
  noLoc = false;
  url_getdata: string = 'Empty url';

  keywordinput = new FormControl('', Validators.required);

  eventBack: any[] = [];
  keywordSgt: any[] = [];

  errorMsg!: string;
  minLengthTerm = 2;

  hoveredRow: any;

  constructor(private http: HttpClient, private renderer: Renderer2) { }

  onSelect(suggestion: string): void {
    this.keywordinput.setValue(suggestion);
    this.showoptions = false;
    const keyword = this.keywordinput.value;
    const inputElem = document.getElementById("keyword") as HTMLInputElement;
    this.renderer.setProperty(inputElem, 'value', keyword);
  }

  public keywordselected(keyword: string): void {
    console.log(keyword);
  }

  ngOnInit(): void {
    this.keywordinput.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.errorMsg = "";
          this.keywordSgt = [];
          this.isLoading = true;
        }),
        switchMap(keyword => {
          if (keyword && keyword.length > 1) {
            this.showoptions = true; 
            return this.http.get(`https://app.ticketmaster.com/discovery/v2/suggest?apikey=YTieJwbkIX90aLCrqmBHc7juN1fsGhGM&keyword=${keyword}`).pipe(
              finalize(() => {
                this.isLoading = false;
              })
            );
          } else {
            return of([]);
          }
        })
      )
      .subscribe((response: any) => {
        this.keywordSgt = response._embedded?.attractions || [];
      });
  }

  getData(event: Event): void {
    event.preventDefault();
    const keyword = this.keywordinput.value;
    const category = (document.getElementById("category") as HTMLSelectElement).value;
    let location = (document.getElementById("location") as HTMLSelectElement).value;
    // 把const改为了let
    const checkdetect = (document.getElementById("check-detect") as HTMLInputElement).value;
    const distanceInput = document.getElementById("distance") as HTMLInputElement;
    const distance = distanceInput.value ? distanceInput.value : 10;
    const norecord = document.getElementById("norecord")!;

    this.eventBack = [];

    if (location === "") {
      this.noLoc = true;
    } else {
      this.noLoc = false;
    }

    // this.url_getdata = `http://localhost:3000/search?keyword=${keyword}&distance=${distance}&category=${category}&location=${location}`;
 this.url_getdata = `https://eventfinderyyz.wl.r.appspot.com/search?keyword=${keyword}&distance=${distance}&category=${category}&location=${location}`;

    this.http.get(this.url_getdata).subscribe((data: any) => {
      

      if (data._embedded && data._embedded.events) { 
      // 这里大于等于改成了大于
        this.eventBack = data._embedded.events;
        this.showTable = true;
        this.noRecord =false;
        this.showCard= false;

      } else {
        this.showTable = false;
        this.noRecord = true;
      }
    });


    this.formSubmitted = true;

      this.eventBack.sort((date, time) => {
        return new Date(date.dates.start.localDate).getTime() - new Date(time.dates.start.localDate).getTime();
      });
  
    
  }

  selectedEvent: any;
  showCard: boolean = false;

  displaycard(event: any) {
    this.selectedEvent = event;
    this.showCard = true;
    this.showTable = false;
  }

  onBack() {
    this.showTable = true;
    this.showCard = false;
  }

  Checkfunc(): void {
    const checkBox = document.getElementById("check-detect") as HTMLInputElement;
    const location = document.getElementById("location") as HTMLInputElement;
  
    if (checkBox.checked) {
      location.value = "Auto-Detecting";
      location.disabled = true;
    } else {
      location.disabled = false;
    }
  }

}
