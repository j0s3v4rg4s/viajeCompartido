import { Component, OnInit } from '@angular/core';
import { NavController ,FabContainer} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
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


  estadoActual: number
  info = []
  marketInit: any
  marketEnd: any
  directionsService: any
  directionsDisplay: any

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController
  ) {
    this.info = [
      {
        texto: 'Selecciona tu punto de partida'
      },
      {
        texto: 'Selecciona tu punto de llegada'
      },
      {
        texto: 'Ajusta tu ruta'
      },
    ]
    this.resetOpciones()
  }

  ngOnInit() {
    this.initMap()
  }

  initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 4.624335, lng: -74.063644 },
      mapTypeControl: false,
      zoom: 8
    });

    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers:true
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

  cabiarEstado() {
    if (this.marketInit && this.estadoActual == 0) {
      this.estadoActual = this.estadoActual + 1
      this.stepAlgoritmo()
    }
    else if (this.marketEnd && this.estadoActual == 1) {
      this.estadoActual = this.estadoActual + 1
      this.stepAlgoritmo()
    }

  }

  resetOpciones() {
    this.estadoActual = 0
    this.marketInit == null
  }

  Clocefab( mifab: FabContainer) {
    mifab.close()
  }

  infoStep() {
    if (this.estadoActual == 0) {
      let toast = this.toastCtrl.create({
        message: 'Seleccione su punto de partida tocando un lugar en el mapa',
        position: 'bottom',
        showCloseButton: true
      });
      toast.present();
    }
    else if (this.estadoActual == 1) {
      let toast = this.toastCtrl.create({
        message: 'Seleccione su punto de llegada tocando un lugar en el mapa',
        position: 'bottom',
        showCloseButton: true
      });
      toast.present();
    }
    else if (this.estadoActual == 2) {
      let toast = this.toastCtrl.create({
        message: 'Para ajstar la ruta, toque la linea azul y desplace el dedo sin dejar de tocar la pantalla',
        position: 'bottom',
        showCloseButton: true
      });
      toast.present();
    }

  }

  stepAlgoritmo() {
    switch (this.estadoActual) {
      case 1:
        document.getElementById('flecha').classList.remove('flecha-activa')
        google.maps.event.clearListeners(map, 'click');
        google.maps.event.addListener(map, 'click', (event) => {
          if (this.marketEnd == null) {
            this.marketEnd = new google.maps.Marker({
              position: event.latLng,
              map: map,
              icon:'assets/icon/bandera.png'
            });
            document.getElementById('flecha').classList.add('flecha-activa')
          }
          else
            this.marketEnd.setPosition(event.latLng)
        });
        break;
      case 2:
        google.maps.event.clearListeners(map, 'click');
        let option = {
          origin: this.marketInit.getPosition(),
          destination: this.marketEnd.getPosition(),
          travelMode: google.maps.TravelMode.DRIVING
        }
        this.directionsService.route(option, (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.directionsDisplay.setDirections(response)
          }
        })
        break;
      default:
        break;
    }
  }

}