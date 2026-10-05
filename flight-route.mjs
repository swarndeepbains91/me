// Great-circle headings are measured clockwise from north, matching north-up maps.
const radians = degrees => degrees * Math.PI / 180;
const degrees = radians => radians * 180 / Math.PI;
export function bearing(from, to) {
    const a = radians(from.lat), b = radians(to.lat), delta = radians(to.lon - from.lon);
    return (degrees(Math.atan2(Math.sin(delta) * Math.cos(b), Math.cos(a) * Math.sin(b) - Math.sin(a) * Math.cos(b) * Math.cos(delta))) + 360) % 360;
}
export function flightGeometry(from, to, width, height) {
    const departure = bearing(from, to);
    const arrival = (bearing(to, from) + 180) % 360;
    const center = { x: width / 2, y: height / 2 };
    const edge = heading => {
        const dx = Math.sin(radians(heading)), dy = -Math.cos(radians(heading));
        const distance = Math.min(width * .42 / Math.max(Math.abs(dx), .001), height * .42 / Math.max(Math.abs(dy), .001));
        return { x: center.x + dx * distance, y: center.y + dy * distance };
    };
    const exit = edge(departure), entry = edge((arrival + 180) % 360);
    return { departure, arrival, center, exit, entry };
}
