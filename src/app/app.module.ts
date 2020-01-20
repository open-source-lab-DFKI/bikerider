import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReactiveFormsModule } from '../../node_modules/@angular/forms';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClientModule } from '@angular/common/http';
import { MmirProvider } from '../providers/mmir';
import { VoiceUIProvider } from '../providers/mmir';
import { AppConfig } from '../providers/app-config';
import { RestApiProvider } from '../providers/rest-api/rest-api';
import { TripproposalsPage } from '../pages/tripproposals/tripproposals';
import {TripPage} from '../pages/trip/trip';
import {Trippropals1Page } from '../pages/trippropals1/trippropals1';

import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';

@NgModule({
  declarations: [
    MyApp,TripproposalsPage,TripPage,Trippropals1Page
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
     
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, TripproposalsPage,TripPage,Trippropals1Page
  ],
  providers: [
    Storage, MmirProvider, VoiceUIProvider, AppConfig,
    StatusBar, SplashScreen, Geolocation,DeviceOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestApiProvider,
  ]
})
export class AppModule {}
