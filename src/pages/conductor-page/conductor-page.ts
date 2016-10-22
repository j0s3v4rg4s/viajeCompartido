import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the ConductorPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-conductor-page',
  templateUrl: 'conductor-page.html'
})
export class ConductorPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello ConductorPage Page');
  }

}
