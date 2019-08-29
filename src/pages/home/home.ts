import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams } from 'ionic-angular';
import { FormControl } from '../../../node_modules/@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import * as _ from 'lodash';
import { Geolocation } from '@ionic-native/geolocation';
import { RestApiProvider } from '../../providers/rest-api/rest-api';

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
  autocompleteLocations = [];
  currentLat: any;
  currentLng: any;
  addressValue: any;
  zoom: number;
  users: any;
  propertyList = [];


  // constructor 
  constructor(public restProvider: RestApiProvider, public http: HttpClient, public geolocation: Geolocation, private ngZone: NgZone, public navCtrl: NavController, public platform: Platform, public navParams: NavParams) {
    this.searchControl = new FormControl();
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder;

  }

  //load all ressources 
  ionViewDidLoad() {
    this.loadMap();
    this.restProvider.getUserIdentifier("abcd1234").then(() => {
      this.getUsersPositions();
    }
    );

  }

  // prevent initialize container error  
  ionViewCanLeave() {
    document.getElementById("map").outerHTML = "";
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
    this.map = L.map("map", {
      minZoom: 4
    }).fitWorld();
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      maxZoom: 23,
      attribution: ''
    }).addTo(this.map);


    this.platform.ready().then(() => {

      this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }).then((resp) => {
        let pos = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        };

        this.currentLat = resp.coords.latitude;
        this.currentLat = resp.coords.longitude;
        this.setAddress(pos);
        this.map.setView([resp.coords.latitude, resp.coords.longitude], 15);
        this.currentLocation = pos;
        this.setAddress(this.currentLocation);
        let markerGroup = L.featureGroup();
        this.marker = L.marker([resp.coords.latitude, resp.coords.longitude], {
          draggable: true
        });
        this.marker.on('dragend', (event) => {
          var position = this.marker.getLatLng();
          this.marker.setLatLng(position, {
            draggable: 'true'
          }).bindPopup(position).update();
          this.currentLocation = position;
          this.map.panTo(this.currentLocation, 15);
          this.setAddress(this.currentLocation);
        });
        markerGroup.addLayer(this.marker);
        this.map.addLayer(markerGroup);

      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }

  //retrieve google autocomplete 
  updateLocation() {
    if (this.autocomplete.input == '') {
      this.autocompleteLocations = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteLocations = [];
        this.ngZone.run(() => {
          _.forEach(predictions, (prediction) => {
            this.autocompleteLocations.push(prediction);
          });
        });
      });
  }
  // choose location after selection
  selectLocation(location) {
    this.autocompleteLocations = [];
    this.searchControl.setValue(location.description);

    this.geocoder.geocode({ 'address': location.description }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        this.currentLat = results[0].geometry.location.lat();
        this.currentLng = results[0].geometry.location.lng();
        this.map.panTo(position, 15);
        this.marker.setLatLng(position);
      }
    })
  }

  // change Adress 
  setAddress(location) {
    this.geocoder.geocode({ 'location': location }, (results, status) => {
      if (status == 'OK' && results[0]) {
        this.address = results[0].formatted_address;
        this.searchControl.setValue(this.address);
      } else {
        console.log('No results found');
      }
    });
  }




}