# Experience Atlas assets

Three.js 0.180.0 and OrbitControls are vendored from the official npm release, under the MIT license in `vendor/LICENSE`. https://threejs.org/

Country polygons: Natural Earth 1:110m admin-0 countries, downloaded from https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson. Natural Earth data is public domain: https://www.naturalearthdata.com/about/terms-of-use/.

Career cities were confirmed by the portfolio owner: CIBC in Toronto, Hotspot Life in Scarborough. IAPP in Mohali and Centennial College in Toronto are stated in the portfolio. Punjab Technical University has no city pin because the portfolio does not specify the study location. Connections illustrate the career journey and do not represent travel records. Map pins use approximate city centers.

Serve `globe.html` through the existing Express server (`npm start`); ES modules and the map fetch require HTTP. Assets are local and need no runtime CDN connection.
