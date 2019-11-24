import { Component, NgZone, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams } from 'ionic-angular';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { FormControl } from '../../../node_modules/@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import * as _ from 'lodash';
import { Geolocation } from '@ionic-native/geolocation';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { TripproposalsPage } from '../tripproposals/tripproposals';
import * as uuid from 'uuid';
 
declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentLocation = {};
  address;
  marker;
  searchControl: FormControl;
  GoogleAutocomplete;
  geocoder;
  autocomplete = { input: '' };
  autocompleteDestination = { input: '' };
  startAutocompleteLocations=[];
  endAutocompleteLocations=[];
  currentLat: any;
  currentLng: any;
  addressValue: any;
  zoom: number;
  users: any;
 
  propertyList = [];
  Locations ={
    startpoint : { lat: null , long: null },
     endpoint : { lat: null , long: null }
  }
  currentposition={lat:null,long:null}
  isEnabled = false   ; 
  id:string= uuid() ; 

  // constructor 
  constructor(public restProvider: RestApiProvider, public http: HttpClient, public geolocation: Geolocation, private ngZone: NgZone, public navCtrl: NavController, 
    public platform: Platform, public navParams: NavParams,public device: DeviceOrientation) {
    
    
 
    
  }
  
  ionViewWillload(){
   
 
  }
  //load all ressources 
  ionViewDidLoad() {
    this.setcurrentlocation();
    this.loadMap();
    this.restProvider.getUserIdentifier(this.id).then((value) => {
       
      // this.getUsersPositions();
     
     }
   
    );

  }
  ionViewCanEnter(){ 
   
  }
  ionViewDidEnter(){
   
  }
 
   // Verify if the two textfields are not empty
   IsEnabled(){
   if(this.autocomplete.input!="" && this.autocompleteDestination.input!="")
     this.isEnabled=true ; 
   
   }
  // prevent initialize container error  
  ionViewCanLeave() {
     document.getElementById("map").outerHTML = "";
     console.log("can leave")  ;
  }


   
  // get users position from restprovider
  getUsersPositions() {
    this.restProvider.getUsersPositions()
      .then(data => {
        
        this.users = data;
        for (const property of this.users) {
          let bikeIcon = L.icon({
            iconUrl: './assets/content/images/bicycle.svg', // url of the icon
            iconSize: [20, 68], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
          });
          L.marker([property.position.latitude, property.position.longitude], { icon: bikeIcon }).addTo(this.map)
            .bindPopup(property.userId)
            .openPopup();
        }
      });
  }

  //load map functions 
  loadMap() {
    this.map = L.map("map");
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      
     
    }).addTo(this.map);


    this.platform.ready().then(() => {

      this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }).then((resp) => {
        let pos = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        };

        // this.currentLat = resp.coords.latitude;
        // this.currentLat = resp.coords.longitude;
        // this.setAddress(pos);
        this.map.setView([resp.coords.latitude, resp.coords.longitude],15);
        
        L.marker([resp.coords.latitude,resp.coords.longitude]).addTo(this.map);
        this.currentLocation = pos;
        // this.setAddress(this.currentLocation);
       

      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }

  //retrieve  autocomplete  startpoint
  StartupdateLocation(location) {
 
    if (location == '') {
      this.startAutocompleteLocations = [];
      return;
    }
    // this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    //   (predictions, status) => {
    //     this.autocompleteLocations = [];
    //     this.ngZone.run(() => {
    //       _.forEach(predictions, (prediction) => {
    //         this.autocompleteLocations.push(prediction);
    //       });
    //     });
    //   });
    this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${location}`)
    .subscribe(result => this.startAutocompleteLocations= result);
     this.IsEnabled();
  }

  // retrieve autocomplete endpoint
  EndupdateLocation(location) {
    
    if (location == '') {
      this.endAutocompleteLocations = [];
      return;
    }
    // this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    //   (predictions, status) => {
    //     this.autocompleteLocations = [];
    //     this.ngZone.run(() => {
    //       _.forEach(predictions, (prediction) => {
    //         this.autocompleteLocations.push(prediction);
    //       });
    //     });
    //   });
    this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${location}`)
    .subscribe(result =>{

      // function that filters the Suggestions in order to get rid of the places not in Berlin 

        var newResult=result.filter(element=>element.display_name.indexOf('Berlin')>-1) ;
    
       
      this.endAutocompleteLocations= newResult;

    });
    

    this.IsEnabled();
   
  }
  // choose location after selection
  selectLocation(location) {
    
    // this.autocompleteLocations = [];
    // this.searchControl.setValue(location.description);

    // this.geocoder.geocode({ 'address': location.description }, (results, status) => {
    //   if (status === 'OK' && results[0]) {
    //     let position = {
    //       lat: results[0].geometry.location.lat(),
    //       lng: results[0].geometry.location.lng()
    //     };
    //     this.currentLat = results[0].geometry.location.lat();
    //     this.currentLng = results[0].geometry.location.lng();
    //     this.map.panTo(position, 15);
    //     this.marker.setLatLng(position);
    //   }
    // })
        this.Locations.startpoint.lat=location.lat ; 
        this.Locations.startpoint.long= location.lon ; 
        this.autocomplete.input=location.display_name;
        this.startAutocompleteLocations=[];
        this.IsEnabled();
        
        
       
        


  }
  //select location for the destination field 
  selectLocationDestination(location) {
        
        this.Locations.endpoint.lat=location.lat ; 
        this.Locations.endpoint.long= location.lon ; 
        this.autocompleteDestination.input=location.display_name;
        this.endAutocompleteLocations=[];
        this.IsEnabled();
      

  }

  // // change Adress 
  // setAddress(location) {
  //   this.geocoder.geocode({ 'location': location }, (results, status) => {
  //     if (status == 'OK' && results[0]) {
  //       this.address = results[0].formatted_address;
  //       this.searchControl.setValue(this.address);
  //     } else {
  //       console.log('No results found');
  //     }
  //   });
  // }

  // go to the trip proposals page 
  goToProposals(){
     
     
    this.navCtrl.push(TripproposalsPage,{
       startpoint: this.currentposition ,
        endpoint: this.Locations.endpoint  
      // startpoint : { lat: 52.524287, long:13.346346 }, 
      // endpoint : { lat: 52.521918, long: 13.413215 },
    })

  }

 
  setcurrentlocation(){
    console.log("hi");
    this.geolocation.getCurrentPosition().then((resp) => {
      
       console.log(resp);
      this.currentposition.lat=resp.coords.latitude;
      this.currentposition.long= resp.coords.longitude ; 
          }).catch((error) => {
       console.log('Error getting location', error);
     });

     this.autocomplete.input="Current position";

  }


}