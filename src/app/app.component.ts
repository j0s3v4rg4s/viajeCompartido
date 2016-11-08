import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';

declare var firebase: any

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      StatusBar.backgroundColorByHexString('#4040bc'); // set status bar to white
      Splashscreen.hide();
      this.loadScript('https://www.gstatic.com/firebasejs/3.5.3/firebase.js', () => {
        var config = {
          apiKey: "AIzaSyCcCaX_kb5RhGpiyCSfapXvHx107AGTGXw",
          authDomain: "viajecompartido-147205.firebaseapp.com",
          databaseURL: "https://viajecompartido-147205.firebaseio.com",
          storageBucket: "viajecompartido-147205.appspot.com",
          messagingSenderId: "154591473645"
        };
        firebase.initializeApp(config);
      })
      this.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyB_H8PBZ5AIGo5rXIAgg1JEQ-8YQ5y1hBg&libraries=places', () => {
        this.rootPage = TabsPage
      })
    });
  }

  loadScript(filename, callback) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.onload = callback;
    fileref.setAttribute("src", filename);
    if (typeof fileref != "undefined") {
      document.getElementsByTagName("head")[0].appendChild(fileref)
    }
  }
}
