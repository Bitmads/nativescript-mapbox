import { Component, OnInit } from "@angular/core";
import { registerElement } from 'nativescript-angular/element-registry';
import {HttpHeaders, HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {environment} from "../../../../../../src/environments/environment";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import * as Https from 'nativescript-https'

declare const android, com, java, org: any;
// register custom views for your app
registerElement('Mapbox', () => require('nativescript-mapbox-bitmads').MapboxDirective);

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    mapboxSdk: any = com.mapbox.mapboxsdk;

    accessToken = 'pk.eyJ1IjoiY3ZlbGV5IiwiYSI6ImNqZ3hxaDJlNTI5M2wzMHAxZmhiN2didGgifQ.P3dSOAlfrWBysiS2sMPJCA';
    MapStyle = 'mapbox://styles/cveley/cjhwl8sxx1a4p2srzofrw40ca';
    constructor(private http: HttpClient,) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        //TEST
        let baseurl = 'http://vagrant.mtp.travel';
        let path ='/user/1';
        let parameters = {};
        console.log('GET', baseurl+`${environment.APIEndpoint}${path}`);
        this.http.get(baseurl+`${environment.APIEndpoint}${path}`, { params:parameters })
            .pipe(
                catchError((err) => {
                        return  throwError(HttpErrorResponse);
                    }
                )
            ).subscribe( response => {
                console.log('response',response);
            })
    }

    mapReady(event){
        console.log('mapReady()',event.map);
        let map = event.map;
        map.setStyle(this.MapStyle).then(style => {
            style.addSource(
                new this.mapboxSdk.style.sources.VectorSource("main-map-tileset-src", "mapbox://cveley.main-map")
            );

            let terrainData = new this.mapboxSdk.style.layers.FillLayer("visited-remaining-polygons", "main-map-tileset-src");
            terrainData.setSourceLayer("locations");

            //console.log('_____________________________________________________________________',new this.mapboxSdk.style.expressions.Expression.literal(new java.lang.Float(1)));
            //let chekedInIds = new this.mapboxSdk.style.expressions.Expression.Array(1);
            //this.mapboxSdk.style.expressions.Expression.Converter.convert('["match", ["get", "locid"],["273",89],"#ffffff","ffffff"]')
            terrainData.setProperties([
                this.mapboxSdk.style.layers.PropertyFactory.fillColor(
                    //android.graphics.Color.parseColor("#ff4836")
                    /*
                    this.mapboxSdk.style.expressions.Expression.match(
                        this.mapboxSdk.style.expressions.Expression.get('locid'),
                        this.mapboxSdk.style.expressions.Expression.literal(new java.lang.Float(1)),
                        android.graphics.Color.parseColor("#000000"),
                        android.graphics.Color.parseColor("#ffffff"),
                    )
                     */
                    this.mapboxSdk.style.expressions.Expression.match(
                        this.mapboxSdk.style.expressions.Expression.get('locid'),
                        this.mapboxSdk.style.expressions.Expression.literal(new java.lang.Integer(1)),
                            com.mapbox.mapboxsdk.style.expressions.Expression.rgb(new java.lang.Integer(1),new java.lang.Integer(1),new java.lang.Integer(1)),
                        this.mapboxSdk.style.expressions.Expression.literal(new java.lang.Integer(2)),
                            com.mapbox.mapboxsdk.style.expressions.Expression.rgb(new java.lang.Integer(1),new java.lang.Integer(1),new java.lang.Integer(1)),
                        com.mapbox.mapboxsdk.style.expressions.Expression.rgb(new java.lang.Integer(1),new java.lang.Integer(1),new java.lang.Integer(1))
                    )
                ),
                this.mapboxSdk.style.layers.PropertyFactory.fillOutlineColor(android.graphics.Color.parseColor("#000000")),
                this.mapboxSdk.style.layers.PropertyFactory.fillOpacity(new java.lang.Float(1)),
            ]);

            /*terrainData.setFilter(com.mapbox.mapboxsdk.style.expressions.Expression.match(
                com.mapbox.mapboxsdk.style.expressions.Expression.get("locid"),
                new java.lang.Integer(273)
            ));*/

            style.addLayer(terrainData);
        })
    }
}
