import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripproposalsPage } from './tripproposals';

@NgModule({
  declarations: [
    TripproposalsPage,
  ],
  imports: [
    IonicPageModule.forChild(TripproposalsPage),
  ],

})
export class TripproposalsPageModule {}
