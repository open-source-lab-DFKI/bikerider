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

import { MmirProvider } from '../providers/mmir';
import { VoiceUIProvider } from '../providers/mmir';
import { AppConfig } from '../providers/app-config';
import { UserAuthProvider } from './../providers/user-auth';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    ReactiveFormsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    Storage, MmirProvider, VoiceUIProvider, AppConfig, UserAuthProvider,
    StatusBar, SplashScreen, Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
