(function() {
    'use strict';

    var vectorLayers = [];

    function mapControl() {
        var element = document.getElementById('map');

        var popupOverlay = new ol.Overlay({
               element: document.getElementById('popup')
        });

        var clicked;

        var highlight;

        var featureToRemove;

        // var baltimore = JSON.parse(baltimoreBoundaries)[0].coordinates;
        // baltimore = parseCoords(baltimore);

        var baltimore1 = JSON.parse(baltimoreBoundaries)[1].coordinates;
        baltimore1 = parseCoords(baltimore1);

        var baltimore2 = JSON.parse(baltimoreBoundaries)[2].coordinates;
        baltimore2 = parseCoords(baltimore2);

        var baltimore3 = JSON.parse(baltimoreBoundaries)[3].coordinates;
        baltimore3 = parseCoords(baltimore3);

        var baltimore4 = JSON.parse(baltimoreBoundaries)[4].coordinates;
        baltimore4 = parseCoords(baltimore4);

        var baltimore5 = JSON.parse(baltimoreBoundaries)[5].coordinates;
        baltimore5 = parseCoords(baltimore5);

        var baltimore6 = JSON.parse(baltimoreBoundaries)[6].coordinates;
        baltimore6 = parseCoords(baltimore6);

        var baltimore7 = "" + (JSON.parse(baltimoreBoundaries)[7].coordinates) + (JSON.parse(baltimoreBoundaries)[8].coordinates) + (JSON.parse(baltimoreBoundaries)[9].coordinates) + (JSON.parse(baltimoreBoundaries)[10].coordinates);
        baltimore7 = parseCoords(baltimore7);

        var baltimore8 = JSON.parse(baltimoreBoundaries)[11].coordinates;
        baltimore8 = parseCoords(baltimore8);

        var baltimore9 = "" + (JSON.parse(baltimoreBoundaries)[12].coordinates) + (JSON.parse(baltimoreBoundaries)[13].coordinates);
        baltimore9 = parseCoords(baltimore9);

        var baltimore10 = "" + (JSON.parse(baltimoreBoundaries)[14].coordinates) + (JSON.parse(baltimoreBoundaries)[15].coordinates);
        baltimore10 = parseCoords(baltimore10);

        var baltimore11 = JSON.parse(baltimoreBoundaries)[16].coordinates;
        baltimore11 = parseCoords(baltimore11);

        var baltimore12 = "" + (JSON.parse(baltimoreBoundaries)[17].coordinates) + (JSON.parse(baltimoreBoundaries)[18].coordinates) + (JSON.parse(baltimoreBoundaries)[19].coordinates) + (JSON.parse(baltimoreBoundaries)[20].coordinates);
        baltimore12 = parseCoords(baltimore12);

        var baltimore13 = JSON.parse(baltimoreBoundaries)[21].coordinates;
        baltimore13 = parseCoords(baltimore13);

        var baltimore14 = "" + (JSON.parse(baltimoreBoundaries)[22].coordinates) + (JSON.parse(baltimoreBoundaries)[23].coordinates);
        baltimore14 = parseCoords(baltimore14);

        var barData = JSON.parse(baltimoreBars);
        var barName = barData.bar_id[0];
        var location = JSON.parse(barData.bar_coordinates[0]);
        var barCoords = ol.proj.fromLonLat([location[1], location[0]]);
        var barLayer = createBarLayers(barCoords, 'bar', barName);
        var vectorSource = new ol.source.Vector({
            features: barLayer,
            wrapX: false
        });
        var vector = new ol.layer.Vector({
            source: vectorSource,
            zIndex: 10
        });
        var barVector = [vector];

        var map = buildMap(buildBaseLayer(), buildMapMarker(createBoundaryLayers(baltimore1, 'baltimore1')), buildMapMarker(createBoundaryLayers(baltimore2, 'baltimore2')), buildMapMarker(createBoundaryLayers(baltimore3, 'baltimore3')), buildMapMarker(createBoundaryLayers(baltimore4, 'baltimore4')), buildMapMarker(createBoundaryLayers(baltimore5, 'baltimore5')), buildMapMarker(createBoundaryLayers(baltimore6, 'baltimore6')), buildMapMarker(createBoundaryLayers(baltimore7, 'baltimore7')), buildMapMarker(createBoundaryLayers(baltimore8, 'baltimore8')), buildMapMarker(createBoundaryLayers(baltimore9, 'baltimore9')), buildMapMarker(createBoundaryLayers(baltimore10, 'baltimore10')), buildMapMarker(createBoundaryLayers(baltimore11, 'baltimore11')), buildMapMarker(createBoundaryLayers(baltimore12, 'baltimore12')), buildMapMarker(createBoundaryLayers(baltimore13, 'baltimore13')), buildMapMarker(createBoundaryLayers(baltimore14, 'baltimore14')), popupOverlay, element);

        var featureOverlay = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 0,
            map: map,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [155, 155, 0],
                    width: 3.5
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 190, 0, 0.8)'
                })
            })
        });

        map.on('pointermove', function(e){
            if (clicked) return;
            if (e.dragging) return;
            var pixel = map.getEventPixel(e.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);
            if(hit) {
                var feature = map.forEachFeatureAtPixel(e.pixel,function(feature) {
                    featureToRemove = feature;
                    if (feature !== highlight) {
                        if (highlight) {
                            featureOverlay.getSource().removeFeature(highlight);
                        }
                        if (feature) {
                            featureOverlay.getSource().addFeature(feature);
                        }
                        highlight = feature;
                    }
                });
            } else {
                if (highlight) {
                    featureOverlay.getSource().removeFeature(highlight);
                    highlight = null;
                }
            }
        });

        map.on('click', function(e) {
            var pixel = map.getEventPixel(e.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);
            if (hit) {
                var feature = map.forEachFeatureAtPixel(e.pixel, function(feature) {
                    return feature;
                });
                if (feature.get('name') === 'bar') {
                    console.log('gotcha');
                    document.querySelector('#popup .popup-content').innerHTML = '<p>' + feature.get('bar') + '</p>';
                    var barCoord = feature.getGeometry().getCoordinates();
                    popupOverlay.setPosition(barCoord);
                }
                map.getView().animate({zoom: 14}, {center: e.coordinate});
            } else {
                return;
            }
        });

        map.getView().on('change:resolution', function setRaduisBox() {
            if (clicked) return;
            if (map.getView().getZoom() >= 14) {
                vectorLayers.forEach(function(layer) {
                    map.removeLayer(layer[0]);
                    clicked = true;
                });
                featureOverlay.getSource().removeFeature(highlight);
                map.addLayer(barVector[0]);
            }
        });
   }

   setTimeout(function(){mapControl();}, 100);

   /**
    * Constructs openLayers Map
    * @param  {Object} baseLayer MapBox tiles
    * @param  {Object} vector    Rectangle radius vector object
    * @return {Object}           OpenLayers Map and configuration
    */
   function buildMap(baseLayer, baltimore1, baltimore2, baltimore3, baltimore4, baltimore5, baltimore6, baltimore7, baltimore8, baltimore9, baltimore10, baltimore11, baltimore12, baltimore13, baltimore14, popupOverlay, element) {
       var layers = [];
       layers.push(baseLayer);
       vectorLayers.push(baltimore1, baltimore2, baltimore3, baltimore4, baltimore5, baltimore6, baltimore7, baltimore8, baltimore9, baltimore10, baltimore11, baltimore12, baltimore13, baltimore14);
       var mapLayers = layers.concat(baltimore1, baltimore2, baltimore3, baltimore4, baltimore5, baltimore6, baltimore7, baltimore8, baltimore9, baltimore10, baltimore11, baltimore12, baltimore13, baltimore14);
       var center = ol.proj.fromLonLat([ -76.593987, 39.286638 ]);
       var map = new ol.Map({
           target: element,
           controls: ol.control.defaults(),
           renderer: 'canvas',
           layers: mapLayers,
           overlays: [popupOverlay],
           view: new ol.View({
               center: center,
               zoom: 11.5,
               maxZoom: 18,
               minZoom: 2
           })
       });
       return map;
   }

   /**
   * Configs base Map layer with tiles sourced from MapBox
   * @return {Object} Vector layer used for map tileing
   */
   function buildBaseLayer() {
       var baseLayer = new ol.layer.Tile({
           source: new ol.source.XYZ({
               url: 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmdhbGFudG93aWN6IiwiYSI6ImNpd3dsNmhyZjAxNWUydHFyNnhjbzZwc3QifQ._xkfHwZJ1FsueAu0K6oQeg'
           })
       });
       return baseLayer;
   }

   function createBoundaryLayers(boundary, name) {
       var boundaryLayers = [];
       var polyArray = [];
       polyArray.push(boundary);
       var iconFeature = new ol.Feature({
           geometry: new ol.geom.Polygon(polyArray),
           name: name
       });
       var iconStyle = new ol.style.Style({
           stroke: new ol.style.Stroke({
               color: [255, 255, 0],
               width: 3.5
           }),
           fill: new ol.style.Fill({
               color: 'rgba(0, 290, 0, 0.4)'
           }),
           text: new ol.style.Text({
               textAlign: 'center',
               textBaseline: 'middle',
               font: 'Verdana',
               text: 'Baltimore',
               fill: new ol.style.Fill({color: 'rgba(0, 290, 0, 0.4)'}),
               stroke: new ol.style.Stroke({color: [255, 255, 0], width: 1}),
               offsetX: 0,
               offsetY: 0,
               scale: 0.9
           })

       });

       iconFeature.setStyle(iconStyle);
       boundaryLayers.push(iconFeature);
       return boundaryLayers;
   }

   function createBarLayers(coordinates, name, bar) {
       console.log(name);
       var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(coordinates),
                name: name,
                bar: bar
            });

        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: 'wp-content/themes/bartimore/images/beer.png',
                scale: 0.2
            })
        });

        iconFeature.setStyle(iconStyle);
        return [iconFeature];
   }

   function buildMapMarker(icons) {
       var vectorArray = [];
       icons.forEach(function buildVector(icon) {
           var vectorSource = new ol.source.Vector({
               features: [icon],
               wrapX: false
           });
           var vector = new ol.layer.Vector({
               source: vectorSource,
               zIndex: 0,
           });
           vectorArray.push(vector);
       });
       return vectorArray;
   }

   function parseCoords(area) {
       var areaCoords = area.split(' , ');
       areaCoords = areaCoords.map(function(coord){
           return ol.proj.fromLonLat(JSON.parse(coord));
       });
       return areaCoords;
   }


}());
