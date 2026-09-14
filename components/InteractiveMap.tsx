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

  // Pure OpenStreetMap implementation using OpenLayers (ol.js & ol.source.OSM)
  const openStreetMapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v9.2.4/ol.css" />
      <script src="https://cdn.jsdelivr.net/npm/ol@v9.2.4/dist/ol.js"></script>
      <style>
        body, html, #map {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background-color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          touch-action: none !important;
          overscroll-behavior: none !important;
          -webkit-user-select: none;
          user-select: none;
        }
        .custom-pin-pickup {
          background-color: #0B1044;
          color: #FFC72C;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid #FFC72C;
          text-align: center;
          white-space: nowrap;
          cursor: pointer;
        }
        .custom-pin-drop {
          background-color: #E11D48;
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid white;
          text-align: center;
          white-space: nowrap;
          cursor: pointer;
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
          text-align: center;
          white-space: nowrap;
        }
        .ol-zoom {
          top: 12px !important;
          right: 12px !important;
          bottom: auto !important;
          left: auto !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
          z-index: 1000 !important;
        }
        .ol-zoom button {
          background-color: #0B1044 !important;
          color: #FFC72C !important;
          border-radius: 10px !important;
          width: 36px !important;
          height: 36px !important;
          font-size: 22px !important;
          font-weight: 900 !important;
          line-height: 1 !important;
          margin: 0 !important;
          border: 2px solid #FFC72C !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .ol-zoom button:hover, .ol-zoom button:active {
          background-color: #FFC72C !important;
          color: #0B1044 !important;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var initialLng = ${center.longitude};
        var initialLat = ${center.latitude};

        // OpenStreetMap Layer via OpenLayers OSM Source
        var osmLayer = new ol.layer.Tile({
          source: new ol.source.OSM()
        });

        var mapView = new ol.View({
          center: ol.proj.fromLonLat([initialLng, initialLat]),
          zoom: ${zoom}
        });

        var map = new ol.Map({
          target: 'map',
          layers: [osmLayer],
          view: mapView,
          controls: ol.control.defaults.defaults({ attribution: false })
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

        // Render Markers using OpenLayers Overlays
        var markersData = ${JSON.stringify(markers)};
        markersData.forEach(function(m) {
          var el = document.createElement('div');
          var pinType = m.type || 'pickup';
          el.className = pinType === 'drop' ? 'custom-pin-drop' : (pinType === 'driver' ? 'custom-pin-driver' : 'custom-pin-pickup');
          el.innerHTML = (pinType === 'driver' ? '🛵 ' : (pinType === 'drop' ? '🎯 ' : '🏬 ')) + (m.title || 'Location');

          var overlay = new ol.Overlay({
            element: el,
            positioning: 'bottom-center',
            stopEvent: false,
            position: ol.proj.fromLonLat([m.longitude, m.latitude])
          });
          map.addOverlay(overlay);
        });

        // Interactive Picker Logic
        if (${interactivePicker}) {
          map.on('click', function(evt) {
            var lonlat = ol.proj.toLonLat(evt.coordinate);
            var lng = lonlat[0];
            var lat = lonlat[1];
            notifyLocationSelected(lat, lng);
          });
        }

        // Completely prevent parent window scrolling when zooming or panning map with fingers
        document.addEventListener('touchmove', function(e) {
          e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchstart', function(e) {
          if (e.touches.length > 1) {
            e.preventDefault();
          }
        }, { passive: false });

        // Render Route Line if enabled
        if (${showRoute} && markersData.length >= 2) {
          var coords = markersData.map(function(m) {
            return ol.proj.fromLonLat([m.longitude, m.latitude]);
          });
          var routeFeature = new ol.Feature({
            geometry: new ol.geom.LineString(coords)
          });
          var routeLayer = new ol.layer.Vector({
            source: new ol.source.Vector({ features: [routeFeature] }),
            style: new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: '#0B1044',
                width: 5,
                lineDash: [8, 8]
              })
            })
          });
          map.addLayer(routeLayer);
          map.getView().fit(routeFeature.getGeometry().getExtent(), { padding: [40, 40, 40, 40] });
        }
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
