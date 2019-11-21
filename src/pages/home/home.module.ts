import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
@NgModule({
  declarations: [
    HomePage,
   
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    
    
  ],
})
export class HomePageModule {}
