import { Component } from '@angular/core';


import {ConductorPage} from '../conductor-page/conductor-page'
import { Pasajero } from '../pasajero/pasajero';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ConductorPage;
  tab2Root: any = Pasajero;

  constructor() {

  }
}
