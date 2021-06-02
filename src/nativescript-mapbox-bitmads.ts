import { Observable } from 'tns-core-modules/data/observable';
import * as app from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { Common } from './nativescript-mapbox-bitmads.common';
import { View, Property } from 'tns-core-modules/ui/core/view';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
var application = require("tns-core-modules/application");

let builder = require('tns-core-modules/ui/builder');
import { Label } from "tns-core-modules/ui/label";
declare const android, com, java, org: any;

export const MapboxDirectiveAccessTokenProperty = new Property<MapboxDirective, string>({ name: "accessToken", defaultValue: "" });
export const MapboxDirectiveCameraProperty = new Property<MapboxDirective, any>({ name: "camera", defaultValue: {zoom:2,center:{lng:0, lat:0}} });
export class MapboxDirective extends View {
  accessToken:string = '';
  settings:any = {};
  nativeView;
  mapView;
  map;
  initNativeView() {
    console.log('::MapboxDirective - initNativeView()');
  }

  createNativeView() {
    console.log('::MapboxDirective - createNativeView()',this.accessToken);
    //Add FrameLayout as placeholder while Mapbox loading
    var nativeView = new android.widget.FrameLayout(this._context);

    //Initialize Map
    try{
      //Wait
      setTimeout(()=>{
        com.mapbox.mapboxsdk.Mapbox.getInstance(this._context, this.accessToken);
        //Check permission then get location
        //console.log('HAS PERMISSION?',this.hasPermission());

        let opt = new com.mapbox.mapboxsdk.maps.MapboxMapOptions()
          .camera(
            new com.mapbox.mapboxsdk.camera.CameraPosition.Builder()
              .target(new com.mapbox.mapboxsdk.geometry.LatLng(this.settings.camera.center.lng, this.settings.camera.center.lat))
              .zoom(this.settings.camera.zoom)
              .build()
          );

        this.mapView = new com.mapbox.mapboxsdk.maps.MapView(this._context,opt);
        this.mapView.onCreate(null);
        this.mapView.getMapAsync(new com.mapbox.mapboxsdk.maps.OnMapReadyCallback({
          onMapReady: mbMap => {
            console.log('onMapReady()   ');
            this.map = mbMap;
            this.notify({
              eventName: 'mapReady',
              object: this,
              mapView: this.mapView,
              map: this,
            });
          }
        }));
        nativeView.addView(this.mapView);
      })

    }catch (ex) {
      console.log("createNativeView exception: " + ex);
    }

    return nativeView;

    //return new android.widget.Button(this._context);
  }

  setStyle(style){
    console.log('setStyle() ',style);
    return new Promise((resolve, reject) => {
      try{
        this.map.setStyle(style, new com.mapbox.mapboxsdk.maps.Style.OnStyleLoaded({
          onStyleLoaded: styleInsatnce =>{
            resolve(styleInsatnce);
          }
        }));
      }catch (e) {
        reject(e);
      }
    });
  }

  // transfer JS text value to nativeView.
  [MapboxDirectiveAccessTokenProperty.setNative](value: string) {
    this.accessToken = value;
  }

  // transfer JS text value to nativeView.
  [MapboxDirectiveCameraProperty.setNative](value: string) {
    this.settings.camera = value;
  }

  initMap() {

  }

  public setAccessToken(accessToken:string){
    this.accessToken = accessToken;
  }
}
MapboxDirectiveAccessTokenProperty.register(MapboxDirective);
MapboxDirectiveCameraProperty.register(MapboxDirective);
/*
export class Mapbox {
    options:any = {}
    static accessToken:string = '';

    setOptions(options){
        this.options = options;
    }

    public static setAccessToken(accessToken:string){
        this.accessToken = accessToken;
    }
}*/

export class CustomXmlView extends GridLayout {
  constructor() {
    super();

    let innerComponent = builder.parse('<Label text="I\'m a customly generated label"></Label>') as View;
    innerComponent.bindingContext = this;

    this.addChild(innerComponent);
  }

}

export class MyCustomView extends View {
  initNativeView() {
    console.log('::MyCustomElement - initNativeView()');
  }

  createNativeView() {
    console.log('::MyCustomElement - createNativeView()');

    //const testLabel = new Label();
    //testLabel.text = "Test";

    const button = new android.widget.Button(this._context);
    button.setText('Click Me');

    button.setOnClickListener(new android.view.View.OnClickListener({
      onClick: function() {
        console.log('BUTTON CLICKED');
      }
    }));
    return button;

  }
}






