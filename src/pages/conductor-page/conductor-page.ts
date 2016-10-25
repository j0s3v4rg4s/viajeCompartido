import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the ConductorPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var google: any;
declare var statusMap: any;
var map;



@Component({
  selector: 'page-conductor-page',
  templateUrl: 'conductor-page.html'
})
export class ConductorPage implements OnInit {


  private index: number
  private info = []
  private marketInit: any

  constructor(public navCtrl: NavController) {
    this.info = [
      {
        texto: 'Selecciona tu punto de partida'
      },
      {
        texto: 'Selecciona tu punto de llegada'
      },
      {
        texto: 'Ajusta tu ruta, Sitúa más puntos en el mapa'
      },
    ]
    this.resetOpciones()
  }

  ngOnInit() {
    let tiempo = window.setInterval(() => {
      if (statusbar) {
        window.clearInterval(tiempo)
        console.log('map init complete');
        this.initMap()
      }
    }, 500)
  }

  initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 4.624335, lng: -74.063644 },
      mapTypeControl: false,
      zoom: 8
    });


    google.maps.event.addListener(map, 'click', (event) => {
      if (this.marketInit == null) {
        this.marketInit = new google.maps.Marker({
          position: event.latLng,
          map: map
        });
        document.getElementById('flecha').classList.add('flecha-activa')
      }

      else
        this.marketInit.setPosition(event.latLng)
    });
  }




  ionViewDidLoad() {

  }

  resetOpciones() {
    this.index = 0
    this.marketInit == null
  }

}