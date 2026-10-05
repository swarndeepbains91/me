// Street-map detail is initialized only when the visitor opens a city.
export function createCityView() {
    const panel = document.getElementById('cityView');
    const status = document.getElementById('cityMapStatus');
    let map, tiles, marker, activePlace;
    function ensureMap() {
        if (map) return;
        if (!window.L) throw new Error('City map library unavailable');
        map = L.map('cityMap', { zoomControl: true, minZoom: 3, maxZoom: 18 });
        tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            updateWhenIdle: true, updateWhenZooming: false, keepBuffer: 1
        });
        tiles.on('loading', () => { status.hidden = false; status.textContent = 'Loading city streets…'; });
        tiles.on('tileload', () => { status.hidden = true; });
        tiles.on('tileerror', () => { status.hidden = false; status.textContent = 'Some map tiles are unavailable. City coordinates and career details remain available.'; });
        tiles.addTo(map);
        new ResizeObserver(() => { if (!panel.hidden) map.invalidateSize({ pan: false }); }).observe(panel);
    }
    return {
        show(place, reduced) {
            activePlace = place;
            panel.hidden = false;
            try {
                ensureMap();
                map.stop();
                map.invalidateSize({ pan: false });
                const latLng = [place.lat, place.lon];
                map.setView(latLng, reduced ? 14 : 9, { animate: false });
                if (marker) marker.remove();
                marker = L.circleMarker(latLng, { radius: 9, color: '#0a675b', weight: 3, fillColor: '#6be2c5', fillOpacity: 1 }).addTo(map);
                marker.bindTooltip(`${place.name} · City center`, { permanent: true, direction: 'top', offset: [0, -10] });
                if (!reduced) map.flyTo(latLng, 14, { duration: 2.2 });
            } catch (error) {
                status.hidden = false;
                status.textContent = 'The street map could not load. Use the map link to explore this location.';
                console.warn(error);
            }
            document.getElementById('cityName').textContent = `${place.name}, ${place.country}`;
            document.getElementById('cityCoordinates').textContent = `${place.lat.toFixed(4)}°, ${place.lon.toFixed(4)}° · Approximate city center`;
            const link = document.getElementById('cityMapLink');
            link.href = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=14/${place.lat}/${place.lon}`;
        },
        pullBack(reduced) {
            if (map && activePlace) {
                map.stop();
                if (reduced) map.setZoom(9, { animate: false });
                else map.flyTo([activePlace.lat, activePlace.lon], 9, { duration: 1 });
            }
        },
        hide() { if (map) map.stop(); panel.hidden = true; },
        zoom(delta) { if (map && !panel.hidden) { map.stop(); map.setZoom(map.getZoom() + delta); return true; } return false; },
        get visible() { return !panel.hidden; }
    };
}
