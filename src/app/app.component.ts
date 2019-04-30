
import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MmirProvider , VoiceUIProvider } from '../providers/mmir';
import { AppConfig } from './../providers/app-config';
import { AppCmd } from '../models/speech/SpeechCommand';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'SearchPage';

  pages: Array<{title: string, component: any}>;

  mmir;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public appConfig: AppConfig,
    public vuiCtrl: VoiceUIProvider<AppCmd>,
    public mmirProvider: MmirProvider<AppCmd>
  ) {

    this.mmir = mmirProvider.mmir;

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Search', component: 'SearchPage' },
      { title: 'Login', component: 'LoginPage' },
      { title: 'Registration', component: 'RegistrationPage' },
      { title: 'Welcome', component: 'WelcomePage' },
      { title: 'Add Appointment', component: 'CalendarPage' }
    ];

  }

  ngOnInit(){
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

	  this.mmirInit();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


  private mmirInit(){

    this.mmirProvider.init(this.platform, this.nav, /*this.events,*/ this.appConfig, [
      { ctrlName: 'Application', name: 'search', view: 'SearchPage' },
      { ctrlName: 'Application', name: 'login', view: 'LoginPage' },
      { ctrlName: 'Application', name: 'registration', view: 'RegistrationPage' },
      { ctrlName: 'Application', name: 'welcome', view: 'WelcomePage' },
      { ctrlName: 'Calendar', name: 'create_appointment', view: 'CalendarPage' }
    ]);

    // this.mmir.ready(() => {
    //
    //   this.appConfig.get('speechEngine').then(defCtx => {
    //     this.mmir.MediaManager.setDefaultCtx(defCtx);
    //   });
    //
    // });
  }

}
