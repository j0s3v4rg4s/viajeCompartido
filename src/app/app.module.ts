import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import {ConductorPage} from '../pages/conductor-page/conductor-page'
import { Pasajero } from '../pages/pasajero/pasajero';

@NgModule({
  declarations: [
    MyApp,
    ConductorPage,
    Pasajero,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ConductorPage,
    Pasajero,
    TabsPage
  ],
  providers: []
})
export class AppModule {}
