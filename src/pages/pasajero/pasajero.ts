import { Component ,OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Pasajero page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var google: any;
declare var statusMap: any

@Component({
  selector: 'page-pasajero',
  templateUrl: 'pasajero.html'
})
export class Pasajero implements OnInit{
  private map: any
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
   this.initMap()
  }
  
  initMap() {
    this.map = new google.maps.Map(document.getElementById('map2'), {
      center: { lat: 4.624335, lng: 	-74.063644},
      mapTypeControl:false,
      zoom: 8
    });
  }

  ionViewDidLoad() {
    
  }

}
