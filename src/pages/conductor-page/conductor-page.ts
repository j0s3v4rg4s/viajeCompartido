import { Component, OnInit } from '@angular/core';
import { NavController, FabContainer } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Back } from '../../providers/back';

import _ from 'underscore';
declare var firebase: any;

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
  templateUrl: 'conductor-page.html',
  providers: [Back]
})
export class ConductorPage implements OnInit {


  estadoActual: number
  estadoAnterior: number
  info = []
  marketInit: any
  marketEnd: any
  directionsService: any
  directionsDisplay: any
  puntosIntermedios = []
  numPunIntermedios = 0
  midleActual: any
  waypts = []
  bloqueado = false
  request: any
  fecha: any;


  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public back: Back
  ) {
    this.estadoActual = 0
    this.fecha = "13:00"
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
      zoom: 12
    });

    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true
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
    else {
      this.estadoActual = this.estadoActual + 1
      this.stepAlgoritmo()
    }

  }

  resetOpciones() {
    this.estadoActual = 0
    this.marketInit == null
  }

  Clocefab(mifab: FabContainer) {
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
      // Selecciona el punto de llegada del usuario
      case 1:
        document.getElementById('flecha').classList.remove('flecha-activa')
        google.maps.event.clearListeners(map, 'click');
        google.maps.event.addListener(map, 'click', (event) => {
          if (this.marketEnd == null) {
            this.marketEnd = new google.maps.Marker({
              position: event.latLng,
              map: map,
              icon: {
                url: 'assets/icon/bandera.png',
                anchor: new google.maps.Point(0, 43)
              }
            });
            document.getElementById('flecha').classList.add('flecha-activa')
          }
          else
            this.marketEnd.setPosition(event.latLng)
        });
        break;
      // Renderiza la ruta del usuario
      case 2:
        google.maps.event.clearListeners(map, 'click');
        this.renderRuta()
        this.addMidlePoint()
        break;

      case 4:
        let pat = this.request.routes[0].overview_path
        let anterior
        _.each(pat, (e, k) => {
          if (anterior == null) {
            let ma = new google.maps.Marker({
              position: new google.maps.LatLng(e.lat(), e.lng()),
              label: '' + k,
              map: map
            })
            anterior = ma
          }
          else {
            let dis = this.back.getDistanceFromLatLonInKm(anterior.getPosition().lat(), anterior.getPosition().lng(), e.lat(), e.lng()) * 1000
            if (dis > 500) {
              let ma = new google.maps.Marker({
                position: new google.maps.LatLng(e.lat(), e.lng()),
                label: '' + k,
                map: map
              })
              anterior = ma
            }
          }

        })
        break;
      default:
        break;
    }
  }

  renderRuta() {
    let option = {
      origin: this.marketInit.getPosition(),
      destination: this.marketEnd.getPosition(),
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: this.waypts,
      optimizeWaypoints: true
    }
    this.directionsService.route(option, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.request = response
        this.directionsDisplay.setDirections(response)
        let legg = response.routes[0].legs
        this.marketInit.setPosition(response.routes[0].legs[0].start_location)
        this.marketEnd.setPosition(response.routes[0].legs[legg.length - 1].end_location)
      }
    })
  }

  addMidlePoint() {
    google.maps.event.addListener(map, 'click', (event) => {
      this.bloqueado = true
      if (this.puntosIntermedios[this.numPunIntermedios] == null) {
        this.mostrarBotones()
        this.puntosIntermedios[this.numPunIntermedios] = new google.maps.Marker({
          position: event.latLng,
          map: map,
        });
      }
      else
        this.puntosIntermedios[this.numPunIntermedios].setPosition(event.latLng)
    });
  }

  /**
   * Cambia el punto de inicio de la ruta
   * @memberOf ConductorPage
   */
  cambiarInicio() {
    if (this.estadoActual == 2) {
      google.maps.event.clearListeners(map, 'click');
    }

    if (this.estadoAnterior == null && this.bloqueado == false) {
      this.bloqueado = true
      this.marketInit.setAnimation(google.maps.Animation.BOUNCE)
      this.marketInit.setDraggable(true)
      map.setCenter(this.marketInit.getPosition())
      this.estadoAnterior = this.estadoActual
      this.estadoActual = 0
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Accion no permitida',
        subTitle: 'Debes primero seleccionar el punto antes de continuar',
        buttons: ['OK']
      });
      alert.present();
    }

  }

  terminarInicio() {
    this.bloqueado = false
    this.marketInit.setAnimation(null)
    this.marketInit.setDraggable(false)
    this.estadoActual = this.estadoAnterior
    this.estadoAnterior = null
    if (this.estadoActual == 2) {
      this.renderRuta()
      this.addMidlePoint()
    }
  }
  /**
   * Cambia el punto de llegada de la ruta
   * @memberOf ConductorPage
   */
  cambiarFinal() {
    if (this.estadoActual == 2) {
      google.maps.event.clearListeners(map, 'click');
    }
    if (this.estadoAnterior == null && this.bloqueado == false) {
      this.bloqueado = true
      this.marketEnd.setAnimation(google.maps.Animation.BOUNCE)
      this.marketEnd.setDraggable(true)
      map.setCenter(this.marketEnd.getPosition())
      this.estadoAnterior = this.estadoActual
      this.estadoActual = 1
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Accion no permitida',
        subTitle: 'Debes primero seleccionar el punto antes de continuar',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  terminarFinal() {
    this.bloqueado = false
    this.marketEnd.setAnimation(null)
    this.marketEnd.setDraggable(false)
    this.estadoActual = this.estadoAnterior
    this.estadoAnterior = null
    if (this.estadoActual == 2) {
      this.renderRuta()
      this.addMidlePoint()
    }
  }

  saveMini() {
    this.mostrarBotones()
    if (this.midleActual == null) {
      var marker = this.puntosIntermedios[this.numPunIntermedios]
      marker.addListener('click', () => {
        google.maps.event.clearListeners(map, 'click');
        if (this.midleActual == null && this.bloqueado == false) {
          this.bloqueado = true
          this.midleActual = marker
          this.midleActual.setAnimation(google.maps.Animation.BOUNCE);
          this.midleActual.setDraggable(true)
          this.mostrarBotones()

          marker.addListener('dragend', () => {
            this.waypts = []
            _.each(this.puntosIntermedios, (e, k, l) => {
              this.waypts.push({
                location: e.getPosition(),
                stopover: true
              });
            })
            this.renderRuta()

          })
        }
        else {
          let alert = this.alertCtrl.create({
            title: 'Accion no permitida',
            subTitle: 'Debes primero guardar el punto antes de continuar',
            buttons: ['OK']
          });
          alert.present();
        }
      });
      this.numPunIntermedios++
      this.waypts.push({
        location: marker.getPosition(),
        stopover: true
      });
      this.renderRuta()

    }
    else {
      this.addMidlePoint()
      this.waypts = []
      _.each(this.puntosIntermedios, (e, k, l) => {
        this.waypts.push({
          location: e.getPosition(),
          stopover: true
        });
      })
      this.midleActual.setDraggable(false)
      this.midleActual.setAnimation(null);
      this.midleActual = null
      this.renderRuta()
    }
    this.bloqueado = false

  }

  removeMini() {
    this.bloqueado = false
    let temp
    if (this.midleActual) {
      temp = this.midleActual
      this.puntosIntermedios = _.without(this.puntosIntermedios, temp)
      this.numPunIntermedios = this.puntosIntermedios.length
      this.waypts = []
      _.each(this.puntosIntermedios, (e, k, l) => {
        this.waypts.push({
          location: e.getPosition(),
          stopover: true
        });
      })
      this.midleActual.setDraggable(false)
      this.midleActual.setAnimation(null);
      this.midleActual = null
      this.renderRuta()
    }
    else {
      temp = this.puntosIntermedios[this.numPunIntermedios]
      this.puntosIntermedios = _.without(this.puntosIntermedios, temp)
      this.numPunIntermedios = this.puntosIntermedios.length

    }
    temp.setMap(null)
    this.mostrarBotones()
  }

  mostrarBotones() {
    document.getElementById('opciones').classList.toggle('noMostrar')
    document.getElementById('aceptar').classList.toggle('noMostrar')
    document.getElementById('cancelar').classList.toggle('noMostrar')
  }

}