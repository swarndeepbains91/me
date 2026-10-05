import { flightGeometry } from './flight-route.mjs';
// Street-map detail is initialized only when the visitor opens a city.
export function createCityView() {
    const panel = document.getElementById('cityView');
    const status = document.getElementById('cityMapStatus');
    let map, tiles, marker, activePlace;
    let travelAnimations = [];
    let geographicPlane, geographicRoute;
    const mapElement = document.getElementById('cityMap');
    const flight = document.getElementById('cityFlight');
    function cancelTravel() {
        travelAnimations.forEach(animation => animation.cancel());
        travelAnimations = [];
        if (map) map.stop();
        geographicPlane?.remove(); geographicRoute?.remove();
        geographicPlane = geographicRoute = null;
        flight.hidden = true;
    }
    function animate(element, frames, duration, signal) {
        if (signal.aborted) return Promise.reject(new DOMException('Tour stopped', 'AbortError'));
        const animation = element.animate(frames, { duration, easing: element.id === 'flightPlane' ? 'linear' : 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
        travelAnimations.push(animation);
        const cancel = () => animation.cancel();
        signal.addEventListener('abort', cancel, { once: true });
        return animation.finished.finally(() => signal.removeEventListener('abort', cancel));
    }
    function caption(place) {
        document.getElementById('cityName').textContent = `${place.name}, ${place.country}`;
        document.getElementById('cityCoordinates').textContent = `${place.lat.toFixed(4)}°, ${place.lon.toFixed(4)}° · Approximate city center`;
        document.getElementById('cityMapLink').href = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=14/${place.lat}/${place.lon}`;
    }
    function placeMarker(place) {
        if (marker) marker.remove();
        marker = L.circleMarker([place.lat, place.lon], { radius: 9, color: '#0a675b', weight: 3, fillColor: '#6be2c5', fillOpacity: 1 }).addTo(map);
        marker.bindTooltip(`${place.name} · City center`, { permanent: true, direction: 'top', offset: [0, -10] });
    }
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
            caption(place);
        },
        async travelTo(place, reduced, signal) {
            if (!map || reduced) { this.show(place, true); return; }
            if (signal.aborted) throw new DOMException('Tour stopped', 'AbortError');
            if (activePlace?.id === place.id) { caption(place); return; }
            cancelTravel();
            const from = activePlace;
            const nearby = map.distance([from.lat, from.lon], [place.lat, place.lon]) < 100000;
            document.getElementById('flightFrom').textContent = from.name;
            document.getElementById('flightTo').textContent = place.name;
            flight.hidden = false;
            try {
                // Only one zoom level of pullback; never use flyTo across continents.
                map.flyTo([from.lat, from.lon], 13, { duration: .8 });
                await animate(flight, [{ opacity: 0 }, { opacity: 1 }], 850, signal);
                const plane = document.getElementById('flightPlane');
                const routeSvg = document.getElementById('flightRoute');
                if (nearby) {
                    // Both the trail and plane are anchored to real map coordinates.
                    plane.hidden = true; routeSvg.setAttribute('hidden', '');
                    const start = L.latLng(from.lat, from.lon), end = L.latLng(place.lat, place.lon);
                    const projectedStart = map.project(start, 13), projectedEnd = map.project(end, 13);
                    const heading = Math.atan2(projectedEnd.y - projectedStart.y, projectedEnd.x - projectedStart.x) * 180 / Math.PI;
                    geographicRoute = L.polyline([start, end], { color: '#237b70', weight: 1.5, opacity: .35, dashArray: '3 7', interactive: false }).addTo(map);
                    geographicPlane = L.marker(start, { interactive: false, keyboard: false, icon: L.divIcon({ className: 'geographic-plane', iconSize: [24, 24], iconAnchor: [12, 12], html: `<svg viewBox="0 0 32 32" style="transform:rotate(${heading}deg)"><path d="M29 14L19 11 15 2 12 2 13 11 5 13 2 10 0 11 3 16 0 21 2 22 5 19 13 21 12 30 15 30 19 21 29 18Q33 16 29 14Z"/></svg>` }) }).addTo(map);
                    const progress = { started: performance.now() };
                    let frame;
                    const move = now => {
                        const t = Math.min(1, (now - progress.started) / 2800);
                        if (geographicPlane && !signal.aborted) geographicPlane.setLatLng(map.unproject(projectedStart.add(projectedEnd.subtract(projectedStart).multiplyBy(t)), 13));
                        if (t < 1 && !signal.aborted) frame = requestAnimationFrame(move);
                    };
                    frame = requestAnimationFrame(move);
                    map.panTo(end, { animate: true, duration: 2.8, easeLinearity: .35 });
                    try { await animate(flight, [{ opacity: 1 }, { opacity: 1 }], 2800, signal); }
                    finally { cancelAnimationFrame(frame); }
                } else {
                    // For long flights, show the true great-circle departure and arrival headings.
                    plane.hidden = false; routeSvg.removeAttribute('hidden');
                    const geometry = flightGeometry(from, place, flight.clientWidth, flight.clientHeight);
                    const { center, exit, entry, departure, arrival } = geometry;
                    flight.dataset.departureBearing = departure.toFixed(2);
                    flight.dataset.arrivalBearing = arrival.toFixed(2);
                    routeSvg.setAttribute('viewBox', `0 0 ${flight.clientWidth} ${flight.clientHeight}`);
                    document.getElementById('flightRoutePath').setAttribute('d', `M${center.x} ${center.y} L${exit.x} ${exit.y} M${entry.x} ${entry.y} L${center.x} ${center.y}`);
                    const at = (point, heading, opacity) => ({ left: `${point.x}px`, top: `${point.y}px`, opacity, transform: `translate(-50%,-50%) rotate(${heading - 90}deg)` });
                    const planeAnimation = animate(plane, [
                        { ...at(center, departure, .85), offset: 0 },
                        { ...at(exit, departure, 0), offset: .46 },
                        { ...at(entry, arrival, 0), offset: .54 },
                        { ...at(center, arrival, .85), offset: 1 }
                    ], 2800, signal);
                    planeAnimation.catch(() => {});
                    await animate(mapElement, [{ opacity: 1 }, { opacity: .55 }], 1300, signal);
                    if (signal.aborted) throw new DOMException('Tour stopped', 'AbortError');
                    map.setView([place.lat, place.lon], 13, { animate: false });
                    activePlace = place; placeMarker(place); caption(place);
                    await Promise.all([planeAnimation, animate(mapElement, [{ opacity: .55 }, { opacity: 1 }], 1500, signal)]);
                }
                activePlace = place; placeMarker(place); caption(place);
                map.flyTo([place.lat, place.lon], 14, { duration: 1.1 });
                await animate(flight, [{ opacity: 1 }, { opacity: 0 }], 1150, signal);
            } finally { cancelTravel(); }
        },
        cancelTravel,
        hide() { cancelTravel(); panel.hidden = true; },
        zoom(delta) { if (map && !panel.hidden) { map.stop(); map.setZoom(map.getZoom() + delta); return true; } return false; },
        get visible() { return !panel.hidden; }
    };
}
