import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { LatLng } from 'leaflet';

/*
  Generated class for the RestApiProvider provider.
*/
@Injectable()
export class RestApiProvider {

  /*******************************
   * Configuration Settings
   */

  // the backend API base address
  apiUrl: string = 'http://lnv-3246.sb.dfki.de:3001/bikerider/v1';

  /*******************************
   * Attributes
   */

  // the temporary identifier generated in the backend
  userId: string;

  // the user's device identifier (e.g., Android ID)
  deviceId: string;

  // the ID of the user's active trip
  activeTripId: string;

  /*******************************
   * CLASS CONSTRUCTOR
   */
  constructor(public http: HttpClient) {

  }

  /******************************
   * API FUNCTIONS
   */

  /**
   * `GET /users`
   * 
   * Returns the position of one or multiple users.
   */
  getUsersPositions() {
    return new Promise(resolve => {
      const options = {
        headers: new HttpHeaders().set('APP-USER-ID', this.userId),
        params: new HttpParams()
      }
      this.http.get(this.apiUrl + '/users', options).subscribe(data => {
        resolve(data);
      }, err => this.handleError(err));
    });
  }

  /**
   * `POST /users`
   * 
   * Create a new temporary User ID.
   * 
   * @param deviceId the (secret) device ID of the user's device, used as a kind of identifier in the app
   */
  getUserIdentifier(deviceId: string) {
    this.deviceId = deviceId;
    return new Promise(resolve => {
      const options = {
        headers: new HttpHeaders(),
        params: new HttpParams().set('device_id', this.deviceId),
      }
      this.http.post(this.apiUrl + '/users', "", options).subscribe(data => {
        this.userId = data['user_id'];
        resolve(data);
      }, err => this.handleError(err));
    });
  }

  /**
   * `PUT /users/{device_id}`
   * 
   * Update the status of an user, this includes
   * - a user's position and the corresponding position timestamp,
   * - a user's ongoing trip indicated by the active_trip_id,
   * - a flag destination_reached that indicates whether the user reached its destination, 
   * - a flag aborted that indicates whether the user (actively) cancelled a trip.
   * 
   * @param currentPosition the user's current position expressed as geo coordinate (latitude, longitude)
   * @param destinationReachedFlag indicates whether the user reached the destination
   * @param abortedFlag indicates whether the user actively cancelled the trip
   */
  updateUser(currentPosition: LatLng, destinationReachedFlag: boolean = false, abortedFlag: boolean = false) {
    // TODO: test this method as it has not been tested yet!
    return new Promise(resolve => {
      const options = {
        headers: new HttpHeaders().set('APP-USER-ID', this.userId),
        params: new HttpParams().set("device_id", this.deviceId),
      }
      var requestBody = {
        "position": currentPosition,
        "position_timestamp": new Date().toISOString(),
        "active_trip_id": this.activeTripId,
        "destination_reached": destinationReachedFlag,
        "aborted": abortedFlag
      }
      this.http.put(`${this.apiUrl}/users/${this.deviceId}`, requestBody, options).subscribe(data => {
        resolve(data);
      }, err => this.handleError(err));
    });
  }

  /**
   * `POST /trip_proposals`
   * 
   * Returns a trip proposal, including its intersections with all active trips.
   *
   * @param fromPosition the start position of the user's trip
   * @param toPosition the end position of the user's trip
   * @param intersections a flag describing whether the API should return route intersections with other users
   */
  getTripProposal(fromPosition: LatLng, toPosition: LatLng, intersections: boolean = true) {
    // TODO: test this method as it has not been tested yet!
    return new Promise(resolve => {
      const options = {
        headers: new HttpHeaders().set('APP-USER-ID', this.userId),
        params: new HttpParams().set("intersections", intersections.toString())
      }
      var requestBody = {
        "start_point": fromPosition,
        "end_point": toPosition
      }
      this.http.post(`${this.apiUrl}/trip_proposals`, requestBody, options).subscribe(data => {
        resolve(data);
      }, err => this.handleError(err));
    });
  }

  /**
   * `GET /trips`
   * 
   * Returns a trip's detailed route for a trip of an given user, identified by its user ID.
   * 
   * @param foreignUserId the user ID of the user whose trip data should be returned
   */
  getTrips(foreignUserId: string) {
    // TODO: test this method as it has not been tested yet!
    return new Promise(resolve => {
      const options = {
        headers: new HttpHeaders().set('APP-USER-ID', this.userId),
        params: new HttpParams().set("user_id", foreignUserId)
      }
      this.http.get(`${this.apiUrl}/trips`, options).subscribe(data => {
        resolve(data);
      }, err => this.handleError(err));
    });
  }

  /******************************
   * UTILITY FUNCTIONS
   */

  /**
   * Method for handling errors within the REST API
   * 
   * @param err 
   */
  handleError(err: Error) {
    console.error(`[REST-API] ${err.message}`);
    console.error(err);
  }

}
