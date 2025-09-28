/* About page JS: Leaflet map for places */
(function() {
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function() {
    var el = document.getElementById('placesMap');
    if (!el || !window.L || !Array.isArray(window.ABOUT_PLACES)) return;

    var theme = document.documentElement.getAttribute('data-theme') || 'light';
    var lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });
    var darkTiles  = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap, &copy; CARTO'
    });

    var map = L.map(el, { zoomControl: true, scrollWheelZoom: true, attributionControl: true });
    var currentTiles = (theme === 'dark') ? darkTiles : lightTiles;
    currentTiles.addTo(map);

    var kindColors = { living: '#22c55e', lived: '#f59e0b', visited: '#60a5fa' };
    var bounds = [];
    window.ABOUT_PLACES.forEach(function(p){
      var lat = parseFloat(p.lat), lon = parseFloat(p.lon);
      if (isNaN(lat) || isNaN(lon)) return;
      var color = kindColors[p.kind] || '#60a5fa';
      var mk = L.circleMarker([lat, lon], { radius: 6, color: '#fff', weight: 1.5, fillColor: color, fillOpacity: 0.95 });
      mk.bindTooltip((p.name || '') + (p.country ? ', ' + p.country : ''), { direction: 'top' });
      mk.addTo(map);
      bounds.push([lat, lon]);
    });

    if (bounds.length === 0) {
      map.setView([0,0], 2);
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 8);
    } else {
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    // Switch tiles on theme change
    document.addEventListener('theme:change', function(ev){
      var next = ev && ev.detail ? ev.detail : 'light';
      map.removeLayer(currentTiles);
      currentTiles = (next === 'dark') ? darkTiles : lightTiles;
      currentTiles.addTo(map);
    });
  });
})();

