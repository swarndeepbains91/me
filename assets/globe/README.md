# Experience Atlas assets

Three.js 0.180.0 and OrbitControls are vendored from the official npm release, under the MIT license in `vendor/LICENSE`. https://threejs.org/

Country polygons: Natural Earth 1:110m admin-0 countries, downloaded from https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson. Natural Earth data is public domain: https://www.naturalearthdata.com/about/terms-of-use/.

Career cities were confirmed by the portfolio owner: CIBC in Toronto, Hotspot Life in Scarborough. IAPP in Mohali and Centennial College in Toronto are stated in the portfolio. Punjab Technical University has no city pin because the portfolio does not specify the study location. Connections illustrate the career journey and do not represent travel records. Map pins use approximate city centers.

Serve `globe.html` through the existing Express server (`npm start`); ES modules and the map fetch require HTTP. Globe geometry and libraries are local and need no runtime CDN connection. City street tiles require an internet connection.

City detail maps use locally vendored Leaflet 1.9.4 (BSD-2-Clause, `vendor/LEAFLET-LICENSE`) and live OpenStreetMap street tiles. Tiles are requested only for the displayed map, with visible attribution and normal browser caching; there is no offline tile download or city prefetch. https://leafletjs.com/reference.html and https://operations.osmfoundation.org/policies/tiles/.

The tour approaches each city on the globe, descends, reveals a street map centered on that city's coordinates, pauses on the career chapter, zooms back out, and flies to the next chapter. Coordinates represent city centers, not employer office addresses. Stop, Escape, choosing another chapter, and page visibility changes cancel the active sequence.
