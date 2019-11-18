import { Component, NgZone, ViewChild, ElementRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RestApiProvider} from '../../providers/rest-api/rest-api' ;
import { AlertController } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import {TripPage} from '../trip/trip';
import {HomePage} from '../home/home' ; 
// import * as L from 'leaflet';
// import 'leaflet-routing-machine' ; 
import'leaflet';
import 'leaflet-routing-machine';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { text } from '@angular/core/src/render3/instructions';
import { stringify } from '@angular/compiler/src/util';
import { a } from '@angular/core/src/render3';
declare var L:any;



/**
 * Generated class for the TripproposalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tripproposals',
  templateUrl: 'tripproposals.html',
})
export class TripproposalsPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker ;
  startLng ; 
  startLat ; 
  endLng ; 
  endLat ;
  decodedPolyline ; 
  decodedPolyline2; 
  polyline="}zq_IgulpA?DKCMC?K@SDi@XyD?MDi@Bg@Dg@VqFJ_BF}@Bg@B_@@GFcA@ODq@NeC@MF}@RgDNiCDg@F_A@M@KBSP_@@SBMNiCDe@B_@Bc@ZqFLqBXoEXsEFgAJuABa@NaC?IB_@Fo@Bi@FwALuCPwC@KDe@B]ZaFn@{J?M@W?WAYLaB?MBU@STuDJaBJ_BHuA@MR_DBa@B]JqA?MDa@@UJUDKLWbBoD@ADOHQJY@IBMJItAuCVm@HQDI|E@F?`@??kF?s@?qF?c@?k@?]?a@?U?S?Q?K?iA?oF?yBFc@Hu@XwAD[Hu@L_AH{@F{@FoA@mA?}@Ci@NAb@Ez@KJARCCg@?IS{HSyGKiD?WGsBAGAk@OaHEuAKqD?OCi@@_@?_@GyBG{BAIAGAKKYEIQa@AECKAEAIMaG?c@KeDG}BAY?UCo@A]C_AASCUa@}CAGMcAEMGIIEGADaAf@eBh@k@CKSw@AAEMOg@K_@CIu@aCe@yA_@mAQg@Oa@?Ea@uAc@sAAEGW@G?IWeAqA_GCKGWNUbBeCDIV_@dA{ADEHMDGZc@Vc@Ra@@ARw@dBsCdBqCd@M@CFIRY\\g@TcAb@q@fAcB_@}@sAgDWq@ED{BdDEFc@qAU\\q@gBiCaHkA_D[{@Si@K[IUYd@GQOa@a@iAW^OTc@sAOa@";
  polyline2="}zq_IgulpA?DKCMC?K@SDi@XyD?MDi@Bg@Dg@VqFJ_BF}@Bg@B_@@GFcA@ODq@NeC@MF}@RgDNiCDg@F_A@M@KBSVHhMtDNDnA}B|AiBh@u@v@gAr@}@j@_AjAeBLZl@i@Jc@@YX}@fBsEtBiFVaA@KBE?C@G?@ZDr@Bb@J`@HB@DBD@XJHOFGFIFKvAsFrCcLVaAfAiE@G@CD]FAVCJ[CuAB?@EVgAEu@CaFGiEIgEA]OaGEcACa@A]M_ECs@Cu@IsDEsBAaAAa@?a@CaCCaBAUAk@?KAk@GsAc@_JCYKeEAa@IoAAYGe@CYEWI}@Sk@U]?KAYCKKm@CoAAUAOEwAZEQ}FAe@KaE?]Cg@OqGImCC}@Aq@E}@IqDCq@EyAAIAc@Ce@?Ee@mPKgEIsDYqJE_BGUEWAMCiACq@Ac@I}CAKAWQmFWyIAYCgACmAGq@EYMcAa@wAKs@Ok@I[CISs@CKCGYcAOi@[gACOm@kBAGCEK_@Si@}@eCQ_@iAoCCGMYRa@@ARw@dBsCdBqCd@M@CFIRY\g@TcAb@q@fAcB_@}@sAgDWq@ED{BdDEFc@qAU\q@gBiCaHkA_D[{@Si@K[IUYd@GQOa@a@iAW^OTc@sAOa@";
   rrroutes=[{id:"12345",pol:this.polyline},{id:"66666",pol:this.polyline2}] ; 
  intersections=[];
  intersection_distance="0";
  routes:any[]=[];
  choosen_route_id=null;
  choosen_route = this.routes[this.choosen_route_id]
  popup:boolean=false ; 
  // startpoint={"lng": 13.3412,"lat": 52.5254}; 
  // endpoint= {"lng": 13.4132,"lat": 52.5219};
  startpoint={"lng":null,"lat":null}; 
  endpoint= {"lng":null,"lat":null};
  distance=[0,0];
  choosen_route_geometry  ; 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public restprovider:RestApiProvider,private alertCtrl: AlertController,public modalCtrl: ModalController) {
  }
  ngOnInit(){
    
     this.delete() ; 
   
   this.loadCoordinates();
   
    this.restprovider.getTripProposal(this.startpoint,this.endpoint).then(data=>{
      this.routes=data['trips'];
     console.log(this.routes);
  }).then(()=>{
     
  console.log(this.routes) ;
  }).then(()=>{
  this.loadmap(this.routes)
  });
 
  
  
   
   console.log("we are there 2") ;
 
    
    
  }
  ionViewWillLoad(){
    
     
    
    
    //  .forEach(trip=>this.routes.push({'id':trip.trip_id ,'pol':trip.geometry})));
   
   
  
   
   
    
 console.log('ionViewDidLoad TripproposalsPage');
    
                  };

 
  ionViewCanLeave() {
   document.getElementById("map").outerHTML = "";
  };
  exit(){
   this.popup=false ; 
   this.choosen_route_id=null  ;
   this.intersection_distance = "0" ;
  }

   // load the coordinates  of the start and end point , which has been given in the pevious view
    loadCoordinates(){
      this.startLat= this.navParams.get('startpoint').lat; 
      this.startLng= this.navParams.get('startpoint').long;
      this.startpoint.lat=this.startLat;
      this.startpoint.lng=this.startLng;
      this.endLat= this.navParams.get('endpoint').lat; 
      this.endLng= this.navParams.get('endpoint').long; 
      this.endpoint.lat=this.endLat;
      this.endpoint.lng=this.endLng;
      console.log(this.startpoint);
      console.log(this.endpoint) ;
    
    }
    // a function that get the trip proposals and have the loadmap() as a callback
 

   
  
    // function to load the map when the view is displayed
 
loadmap(fake_trips){
console.log(fake_trips);
  this.map = L.map("map", {
    minZoom: 4
  }).fitWorld();
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 23,
    attribution: ''
  }).addTo(this.map);
  this.map.setView([52.520008, 13.404954],15);
  
  //polyline 1
  
//   this.decodedPolyline.forEach(element=>{
    
//   }) 
 
var group = new L.FeatureGroup() ; 
 
fake_trips.forEach(function(route,index){
  console.log('thhh');
  var  colors = ['blue','DarkSlateBlue','DodgerBlue ','darkblue ','CornflowerBlue ','yellow','green','purple'];
  this.decodedPolyline=this.decode(route.geometry);
  
  
  var coordinates = this.decodedPolyline.map(waypoint => new L.LatLng(waypoint.latitude,waypoint.longitude))

    let polyline = L.polyline(
    coordinates,
    {  
        color:colors[index],
        weight:8,
        opacity:0.9,
         lineJoin: 'round'
       
     }
  );
   

  
   
  polyline.on('click',(e)=>{
    this.popup=true ; 
    this.choosen_route_id=this.routes[index]['trip_id'];
    this.choosen_route_geometry=this.routes[index].geometry;

    var overall = this.routes[index]['distance'] ; 
    this.distance[0]=this.routes[index]['distance'];
    var intersections_array = this.routes[index]['trip_intersections']; 
     var sum=0 ;
     intersections_array.forEach(element =>
      sum+=element.distance
      ) ; 
     this.intersection_distance=sum.toString().trim().split('.')[0];
      
    
    // if(intersections_array.length!=0){
    //   var sum =0 ;
      
    // }
    
  })
  polyline.addTo(this.map);

  this.map.fitBounds(polyline.getBounds());
    //add markers to the map
    L.marker([this.startpoint.lat,this.startpoint.lng],{
      size:'5px' 
    }).addTo(this.map);
    L.marker([this.endpoint.lat,this.endpoint.lng],{
      color:'red' 
      
    }).addTo(this.map);
     

  this.draw(route);

},this);
/// draw the overlaps 
 
 
  
// //  // polyline 2

// this.decodedPolyline=this.decode(this.polyline2);
// var coordinates2 = this.decodedPolyline.map(waypoint => new L.LatLng(waypoint.latitude,waypoint.longitude))

//  let a = L.polyline(
//  coordinates2,
//  {
//      color: 'red',
//      weight: 3,
//      opacity: .7,
//       lineJoin: 'round'
//   }
// );

// a.addTo(this.map);

 


//    //end of polyline 2

//    var latlang = [
//     [[17.385044, 78.486671], [16.506174, 80.648015], [17.686816, 83.218482]],
//     [[13.082680, 80.270718], [12.971599, 77.594563],[15.828126, 78.037279]]
//  ];
//  // Creating multi polyline options
// var multiPolyLineOptions = {color:'red'};

// // Creating multi polylines
// var multipolyline = L.polyline(latlang , multiPolyLineOptions);
// // Adding multi polyline to map
// multipolyline.addTo(this.map);
// this.map.fitBounds(multipolyline.getBounds());

  
  // this.b.push(L.latLng(52.5254,13.3412)) ; 
  // this.b.push(L.latLng(52.5219,13.4132)) ; 
  
 

  //  L.Routing.control({
  //  waypoints:this.b,
  //  routeWhileDragging: true,
  // router: L.Routing.mapbox('pk.eyJ1IjoibW8zdGF6OTIiLCJhIjoiY2sxdm8zOWd4MTE2YzNlcXkxOWt4NzgyNiJ9.yUcVXhWTOr6x4mQ7ypjukQ')
  // }).addTo(this.map);
//   var latlngs = [[52.4117,12.5369],[52.5219,13.4132],[52.5105, 13.4346]];
//   var polyline = L.polygon(latlngs, {
//     color: 'blue',
//     weight: 3,
//     opacity: .7,
//     lineJoin: 'round'
// }).addTo(this.map);
//   this.map.fitBounds(polyline.getBounds());



 }
 draw(route){
  if(route['trip_intersections'].length!=0){
    
    var a = route['trip_intersections'][0]['intersections'];
   
    a.forEach(item =>{
      
     this.decodedPolyline=this.decode(item);
      
     
     var coordinates = this.decodedPolyline.map(waypoint => new L.LatLng(waypoint.latitude,waypoint.longitude))
   
       let polyline = L.polyline(
       coordinates,
       {  
           color:'green',
           weight:8,
           opacity:0.8,
            lineJoin: 'round'
          
        }
     );
   
     polyline.addTo(this.map);
   
 
  
     
   });
    
   }

 }

// Polyline decoder
 
// put request
update_user(){
 
 this.restprovider.update_trip(this.startpoint,this.choosen_route_id,false,false)
  .then(data=>console.log(data)) ; 
 
 this.backward();
 
}
 
delete(){
//   console.log('delete') ; 
 
  this.restprovider.update_trip(this.startpoint,'3848b787-e298-4f41-9ee9-048c2e64d59f',true,true)
   .then(data=>console.log(data)) ;

    
  this.restprovider.update_trip(this.startpoint,'5fc654c9-9087-468d-af10-e1e81859b802',true,true)
  .then(data=>console.log(data)) ;
   
  this.restprovider.update_trip(this.startpoint,'fd8c7a73-634d-4408-a211-a0935a80b310',true,true)
   .then(data=>console.log(data)) ;
    
  this.restprovider.update_trip(this.startpoint,'d0379c21-46cb-4bae-af26-a3fff0ecb146',true,true)
  .then(data=>console.log(data)) ;
   
}

decode(encoded){

  // array that holds the points

  var points=[ ]
  var index = 0, len = encoded.length;
  var lat = 0, lng = 0;
  while (index < len) {
      var b, shift = 0, result = 0;
      do {

  b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii                                                                                    //and substract it by 63
            result |= (b & 0x1f) << shift;
            shift += 5;
           } while (b >= 0x20);


     var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
     lat += dlat;
    shift = 0;
    result = 0;
   do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
     shift += 5;
       } while (b >= 0x20);
   var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
   lng += dlng;

 points.push({latitude:( lat / 1E5),longitude:( lng / 1E5)})  

}
return points
  }

/**** */
 
backward(){
 this.navCtrl.setRoot(TripPage,{
   startpoint:this.startpoint , 
   endpoint:this.endpoint ,
   route_id:this.choosen_route_id,
   route:this.choosen_route_geometry
 })
}

 


 
}
