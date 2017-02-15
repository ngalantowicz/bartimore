(function() {
    'use strict';

    var boundaryLayers = [];

    function mapControl() {
        var element = document.getElementById('map');

        var popupOverlay = new ol.Overlay({
               element: document.getElementById('popup')
        });

        var clicked;

        var highlight;

        var featureToRemove;

        var cursorSet;

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

        var barLayers = transformBarData();

        var map = buildMap(buildBaseLayer(), buildMapMarker(createBoundaryLayers(baltimore1, 'baltimore1')), buildMapMarker(createBoundaryLayers(baltimore2, 'baltimore2')), buildMapMarker(createBoundaryLayers(baltimore3, 'baltimore3')), buildMapMarker(createBoundaryLayers(baltimore4, 'baltimore4')), buildMapMarker(createBoundaryLayers(baltimore5, 'baltimore5')), buildMapMarker(createBoundaryLayers(baltimore6, 'baltimore6')), buildMapMarker(createBoundaryLayers(baltimore7, 'baltimore7')), buildMapMarker(createBoundaryLayers(baltimore8, 'baltimore8')), buildMapMarker(createBoundaryLayers(baltimore9, 'baltimore9')), buildMapMarker(createBoundaryLayers(baltimore10, 'baltimore10')), buildMapMarker(createBoundaryLayers(baltimore11, 'baltimore11')), buildMapMarker(createBoundaryLayers(baltimore12, 'baltimore12')), buildMapMarker(createBoundaryLayers(baltimore13, 'baltimore13')), buildMapMarker(createBoundaryLayers(baltimore14, 'baltimore14')), element);

        map.addOverlay(popupOverlay);

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
                    color: 'rgba(0, 0, 0, 0.8)'
                })
            })
        });

        map.on('pointermove', function(e){
            if (cursorSet) return;
            if (e.dragging) return;
            var pixel = map.getEventPixel(e.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);
            if(hit) {
                var feature = map.forEachFeatureAtPixel(e.pixel,function(feature) {
                    if (clicked && feature) {
                        e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
                        cursorSet = true;
                        return;
                    }
                    featureToRemove = feature;
                    if (!clicked && feature !== highlight) {
                        if (highlight) {
                            featureOverlay.getSource().removeFeature(highlight);
                        }
                        if (!clicked && feature) {
                            featureOverlay.getSource().addFeature(feature);
                        }
                        highlight = feature;
                    }
                });
            } else {
                if (!clicked && highlight) {
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
                    document.querySelector('#popup .popup-content').innerHTML = '<p id="popup-title"><a href="/bars/' + feature.get('slug') + '/">' + feature.get('bar') + '</a></p><p id="popup-sum">'  + feature.get('summary') + '</p>';
                    var barCoord = feature.getGeometry().getCoordinates();
                    popupOverlay.setPosition(barCoord);
                }
                map.getView().animate({zoom: getZoom(true)}, {center: e.coordinate});
            } else {
                popupOverlay.setPosition(undefined);
            }
        });

        map.getView().on('change:resolution', function setRaduisBox() {
            if (clicked) return;
            if (map.getView().getZoom() >= 13.5) {
                boundaryLayers.forEach(function(layer) {
                    map.removeLayer(layer[0]);
                    clicked = true;
                });
                if (!/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)) {
                    featureOverlay.getSource().removeFeature(highlight);
                }
                barLayers.forEach(function(bar) {
                    map.addLayer(bar[0]);
                });
            }
        });
   }

   setTimeout(function(){mapControl();}, 250);

   /**
    * Constructs openLayers Map
    * @param  {Object} baseLayer MapBox tiles
    * @param  {Object} vector    Rectangle radius vector object
    * @return {Object}           OpenLayers Map and configuration
    */
   function buildMap(baseLayer, baltimore1, baltimore2, baltimore3, baltimore4, baltimore5, baltimore6, baltimore7, baltimore8, baltimore9, baltimore10, baltimore11, baltimore12, baltimore13, baltimore14, element) {
       var layers = [baseLayer];
       boundaryLayers.push(baltimore1, baltimore2, baltimore3, baltimore4, baltimore5, baltimore6, baltimore7, baltimore8, baltimore9, baltimore10, baltimore11, baltimore12, baltimore13, baltimore14);
       var mapLayers = layers.concat(baltimore1, baltimore2, baltimore3, baltimore4, baltimore5, baltimore6, baltimore7, baltimore8, baltimore9, baltimore10, baltimore11, baltimore12, baltimore13, baltimore14);
       var center = ol.proj.fromLonLat([ -76.623987, 39.286638 ]);
       var map = new ol.Map({
           target: element,
           controls: ol.control.defaults(),
           renderer: 'canvas',
           layers: mapLayers,
           view: new ol.View({
               center: center,
               zoom: getZoom(false),
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
               color: [204, 204, 204],
               width: 1.5
           }),
           fill: new ol.style.Fill({
               color: 'rgba(173, 152, 193, 0.25)'
           }),
           text: new ol.style.Text({
               textAlign: 'center',
               textBaseline: 'middle',
               font: 'Verdana',
               text: '',
               fill: new ol.style.Fill({color: 'rgba(0, 290, 0, 0.4)'}),
               stroke: new ol.style.Stroke({color: [255, 255, 0], width: 1}),
               offsetX: 0,
               offsetY: 0,
               scale: 0.9
           })

       });

       iconFeature.setStyle(iconStyle);
       return [iconFeature];
   }

   function createBarLayers(coordinates, name, bar, slug, summary) {
       var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(coordinates),
                name: name,
                bar: bar,
                slug: slug,
                summary: summary,
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

   function buildMapMarker(markers) {
       var vectorArray = [];
       markers.forEach(function buildVector(marker) {
           var vectorSource = new ol.source.Vector({
               features: [marker],
               wrapX: false
           });
           var vector = new ol.layer.Vector({
               source: vectorSource,
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

   function transformBarData() {
       var layers = [];
       var barData = JSON.parse(baltimoreBars);
       barData.map(function(bar) {
          bar.bar_coords = ol.proj.fromLonLat(JSON.parse(bar.bar_coords));
       });
       barData.forEach(function(bar) {
           var layer = buildMapMarker(createBarLayers(bar.bar_coords, 'bar', bar.bar_name, bar.bar_slug, bar.bar_summary));
           layers.push(layer);
       });
       return layers;
   }

   function getZoom(animate) {
       var zoom;
       if ( window.outerWidth < 550 && !animate) {
            zoom = 10;
       } else if ( window.outerWidth < 550 && animate) {
            zoom = 13.5;
       } else if ( window.outerWidth > 550 && !animate) {
            zoom = 11.5;
       } else if ( window.outerWidth > 550 && animate) {
           zoom = 14;
       }
       return zoom;
   }


}());
