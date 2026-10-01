import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Platform, Text } from 'react-native';

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  type?: 'pickup' | 'drop' | 'driver';
}

interface InteractiveMapProps {
  height?: number | string;
  center?: { latitude: number; longitude: number };
  zoom?: number;
  markers?: MapMarker[];
  showRoute?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  interactivePicker?: boolean;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
}

export default function InteractiveMap({
  height = 300,
  center = { latitude: 6.9271, longitude: 79.8612 }, // Default Colombo
  zoom = 14,
  markers = [
    { id: '1', latitude: 6.9271, longitude: 79.8612, title: 'Current Location', type: 'driver' },
  ],
  showRoute = false,
  onLocationSelect,
  interactivePicker = false,
  onTouchStart,
  onTouchEnd,
}: InteractiveMapProps) {
  const webViewRef = useRef<any>(null);

  // Sanitize markers to remove invalid or NaN coordinates
  const validMarkers = (markers || []).filter(
    (m) => m && typeof m.latitude === 'number' && typeof m.longitude === 'number' && !isNaN(m.latitude) && !isNaN(m.longitude)
  );

  const mapCenter = validMarkers.length > 0
    ? { latitude: validMarkers[0].latitude, longitude: validMarkers[0].longitude }
    : center;

  // Pure OpenStreetMap HTML powered by OpenLayers JS engine (No Leaflet dependency)
  const openStreetMapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v7.5.0/ol.css" />
      <script src="https://cdn.jsdelivr.net/npm/ol@v7.5.0/dist/ol.js"></script>
      <style>
        html, body, #map {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          background: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          touch-action: none !important;
          overscroll-behavior: none !important;
          -webkit-user-select: none;
          user-select: none;
        }
        .ol-control button {
          background-color: #0B1044 !important;
          color: #FFC72C !important;
          font-weight: bold;
          border-radius: 8px !important;
        }
        .custom-pin-pickup {
          background-color: #0B1044;
          color: #FFC72C;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          border: 2px solid #FFC72C;
          white-space: nowrap;
          text-align: center;
          transform: translate(-50%, -50%);
        }
        .custom-pin-drop {
          background-color: #E11D48;
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          border: 2px solid white;
          white-space: nowrap;
          text-align: center;
          transform: translate(-50%, -50%);
        }
        .custom-pin-driver {
          background-color: #FFC72C;
          color: #0B1044;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          border: 2px solid #0B1044;
          white-space: nowrap;
          text-align: center;
          transform: translate(-50%, -50%);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var initialLat = ${mapCenter.latitude};
        var initialLng = ${mapCenter.longitude};
        var initialCenter = ol.proj.fromLonLat([initialLng, initialLat]);

        var map = new ol.Map({
          target: 'map',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          view: new ol.View({
            center: initialCenter,
            zoom: ${zoom}
          }),
          controls: ol.control.defaults.defaults({ zoom: true, attribution: false })
        });

        function notifyLocationSelected(lat, lng) {
          var msg = JSON.stringify({ type: 'location_selected', lat: lat, lng: lng });
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(msg);
          }
          if (window.parent && window.parent.postMessage) {
            window.parent.postMessage(msg, '*');
          }
        }

        var markersData = ${JSON.stringify(validMarkers)};
        var olCoords = [];

        markersData.forEach(function(m) {
          var pinType = m.type || 'pickup';
          var className = pinType === 'drop' ? 'custom-pin-drop' : (pinType === 'driver' ? 'custom-pin-driver' : 'custom-pin-pickup');
          var labelHtml = (pinType === 'driver' ? '🛵 ' : (pinType === 'drop' ? '🎯 ' : '🏬 ')) + (m.title || 'Location');

          var el = document.createElement('div');
          el.className = className;
          el.innerHTML = labelHtml;

          var coord = ol.proj.fromLonLat([m.longitude, m.latitude]);
          olCoords.push(coord);

          var overlay = new ol.Overlay({
            position: coord,
            positioning: 'center-center',
            element: el,
            stopEvent: false
          });
          map.addOverlay(overlay);
        });

        if (${showRoute}) {
          var pickupM = markersData.find(function(m) {
            var t = (m.type || '').toLowerCase();
            return t === 'pickup' || t === 'user' || t === 'current_location';
          });
          var dropM = markersData.find(function(m) {
            var t = (m.type || '').toLowerCase();
            return t === 'drop' || t === 'dropoff' || t === 'destination';
          });

          if (!pickupM && markersData.length >= 2) pickupM = markersData[0];
          if (!dropM && markersData.length >= 2) dropM = markersData[1];

          if (pickupM && dropM) {
            var osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + pickupM.longitude + ',' + pickupM.latitude + ';' + dropM.longitude + ',' + dropM.latitude + '?overview=full&geometries=geojson';

            fetch(osrmUrl)
              .then(function(res) { return res.json(); })
              .then(function(data) {
                if (data && data.routes && data.routes.length > 0 && data.routes[0].geometry && data.routes[0].geometry.coordinates) {
                  var roadCoords = data.routes[0].geometry.coordinates.map(function(pt) {
                    return ol.proj.fromLonLat([pt[0], pt[1]]);
                  });
                  drawRoutePolyline(roadCoords);
                } else {
                  var directCoords = [ol.proj.fromLonLat([pickupM.longitude, pickupM.latitude]), ol.proj.fromLonLat([dropM.longitude, dropM.latitude])];
                  drawRoutePolyline(directCoords);
                }
              })
              .catch(function() {
                var directCoords = [ol.proj.fromLonLat([pickupM.longitude, pickupM.latitude]), ol.proj.fromLonLat([dropM.longitude, dropM.latitude])];
                drawRoutePolyline(directCoords);
              });
          }
        } else if (olCoords.length === 1) {
          map.getView().setCenter(olCoords[0]);
          map.getView().setZoom(${zoom});
        }

        function drawRoutePolyline(coords) {
          var routeFeature = new ol.Feature({
            geometry: new ol.geom.LineString(coords)
          });

          var routeStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#2563EB',
              width: 5
            })
          });

          var vectorSource = new ol.source.Vector({
            features: [routeFeature]
          });

          var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: routeStyle
          });

          map.addLayer(vectorLayer);

          try {
            map.getView().fit(vectorSource.getExtent(), { padding: [45, 45, 45, 45], maxZoom: 16 });
          } catch(e) {}
        }

        if (${interactivePicker}) {
          map.on('click', function(evt) {
            var lonLat = ol.proj.toLonLat(evt.coordinate);
            notifyLocationSelected(lonLat[1], lonLat[0]);
          });
        }

        setTimeout(function() {
          map.updateSize();
        }, 300);
      </script>
    </body>
    </html>
  `;

  // Listen for Web iframe messages
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleWebMessage = (e: MessageEvent) => {
        try {
          const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
          if (data && data.type === 'location_selected' && onLocationSelect) {
            onLocationSelect(data.lat, data.lng);
          }
        } catch {
          // ignore parsing error
        }
      };
      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [onLocationSelect]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'location_selected' && onLocationSelect) {
        onLocationSelect(data.lat, data.lng);
      }
    } catch (e) {
      // Ignore parse errors
    }
  };

  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && containerRef.current) {
      const el = containerRef.current;
      const preventScroll = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          e.stopPropagation();
        }
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };
      el.addEventListener('touchstart', preventScroll, { passive: false });
      el.addEventListener('touchmove', preventScroll, { passive: false });
      return () => {
        el.removeEventListener('touchstart', preventScroll);
        el.removeEventListener('touchmove', preventScroll);
      };
    }
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={[styles.container, { height: height as any, touchAction: 'none' }]}>
        {React.createElement('iframe', {
          srcDoc: openStreetMapHtml,
          style: { width: '100%', height: '100%', border: 'none', touchAction: 'none' },
          title: 'OpenStreetMap Live Navigation Map',
        })}
      </View>
    );
  }

  // Native WebView
  let WebViewComponent: any = null;
  try {
    const { WebView } = require('react-native-webview');
    WebViewComponent = WebView;
  } catch {
    WebViewComponent = null;
  }

  return (
    <View
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      style={[styles.container, { height: height as any }]}>
      {WebViewComponent ? (
        <WebViewComponent
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: openStreetMapHtml }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={handleMessage}
        />
      ) : (
        <View style={styles.fallback}>
          <Text style={{ color: '#0B1044', fontWeight: 'bold' }}>📍 OpenStreetMap Live</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#CBD5E1',
    overflow: 'hidden',
    borderRadius: 16,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
