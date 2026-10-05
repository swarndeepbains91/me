const locations = [
    {id:'toronto',name:'Toronto',country:'Canada',lat:43.6532,lon:-79.3832},
    {id:'scarborough',name:'Scarborough',country:'Canada',lat:43.7764,lon:-79.2318},
    {id:'mohali',name:'Mohali',country:'India',lat:30.7046,lon:76.7179}
];
const chapters = [
    {id:'manager',type:'work',location:'toronto',year:2025,date:'April 2025 — Present',title:'Senior Manager',company:'CIBC Financial Crimes',subtitle:'Core Protection Team',copy:'Leading strategic initiatives in financial crimes technology, overseeing critical protection systems, and managing cross-functional teams to deliver enterprise-level security solutions.',tags:['Strategic leadership','Core protection','Financial crimes']},
    {id:'tech-lead',type:'work',location:'toronto',year:2022,date:'September 2022 — March 2025',title:'Tech Lead',company:'CIBC Financial Crimes',subtitle:'Application Operations',copy:'Led service review calls, managed applications and infrastructure, onboarded new technology through pilot projects, and provided 24×7 on-call support for critical incidents.',tags:['Application operations','Service reviews','Incident response']},
    {id:'team-lead',type:'work',location:'toronto',year:2020,date:'September 2020 — August 2022',title:'Team Lead',company:'CIBC Financial Crimes',subtitle:'Application Integration',copy:'Migrated Actimize Actone to the cloud, configured CI/CD pipelines on Jenkins for OpenShift deployments, and led Autosys migration projects.',tags:['OpenShift','Jenkins','Cloud migration']},
    {id:'senior-analyst',type:'work',location:'toronto',year:2019,date:'November 2019 — September 2020',title:'Senior Technical Analyst',company:'CIBC',subtitle:'Branch Support Operations',copy:'Managed production servers supporting CIBC branches through monitoring, backups, and troubleshooting. Coordinated technical plans, branch connectivity, and incident resolution with specialist teams and vendors.',tags:['Production support','Networking','Incident management']},
    {id:'analyst',type:'work',location:'toronto',year:2018,date:'May 2018 — November 2019',title:'Technical Analyst',company:'CIBC',subtitle:'Branch Support Operations',copy:'Supported production servers, investigated technical problems, configured server patches, and worked with connectivity and ABM vendors to support branch operations.',tags:['Server administration','Branch operations','Technical support']},
    {id:'college',type:'education',location:'toronto',year:2016,date:'2016 — 2018',title:'Computer System Technology',company:'Centennial College',subtitle:'Networking',copy:'Developed an academic foundation in networking and computer system technology at Centennial College in Toronto.',tags:['Networking','Computer systems','Education']},
    {id:'coop',type:'work',location:'toronto',year:2016,date:'September 2016 — May 2017',title:'Technical Analyst Co-op',company:'CIBC',subtitle:'Branch Support Operations',copy:'Configured newly installed servers, prepared production servers for branch use, verified system events, and helped investigate and resolve technical problems.',tags:['Server configuration','Operations','Technical support']},
    {id:'hotspot',type:'work',location:'scarborough',year:2016,date:'June 2016 — November 2017',title:'iOS Developer',company:'Hotspot Life',subtitle:'Startup application development',copy:'Designed application interfaces in Objective-C, managed Firebase integrations, and published the app to the App Store. Implemented maps, push notifications, and chat using Firebase data listeners.',tags:['Objective-C','Firebase','iOS','App Store']},
    {id:'iapp',type:'work',location:'mohali',year:2014,date:'May 2014 — November 2015',title:'Jr. iOS Developer',company:'IAPP Technologies',subtitle:'Mobile application development',copy:'Designed and built iOS applications, collaborated on app features, resolved performance bottlenecks and bugs, and published applications on the App Store.',tags:['iOS','Application design','Performance','App Store']},
    {id:'university',type:'education',location:null,year:2010,date:'2010 — 2014 · Punjab, India',title:'Bachelor in Computer Science',company:'Punjab Technical University',subtitle:'Academic foundation',copy:'An academic foundation in computer science. The portfolio lists Punjab, India; a city pin is omitted because the study location is not specified.',tags:['Computer science','Education']}
];
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let selected = chapters[0], filter = 'all', placeFilter = null, globe = null, tourTimer = null, tourIndex = 0;
const tourChapters = [...chapters].filter(chapter=>chapter.type==='work').reverse();
function stopTour() { clearTimeout(tourTimer); tourTimer=null; $('tourToggle').setAttribute('aria-pressed','false'); $('tourToggle').textContent='▶ Play career tour'; }
function renderList() {
    const visible = chapters.filter(c=>(filter==='all'||c.type===filter)&&(!placeFilter||c.location===placeFilter));
    $('chapterList').replaceChildren(...visible.map(chapter=>{
        const button = document.createElement('button'); button.className='chapter'; button.dataset.chapter=chapter.id; button.setAttribute('aria-pressed',String(selected.id===chapter.id));
        const date=document.createElement('small'); date.textContent=chapter.date;
        const title=document.createElement('strong');title.textContent=chapter.title;
        const company=document.createElement('small');company.textContent=chapter.company;
        const place=document.createElement('span');place.className='chapter-place';place.textContent=locations.find(l=>l.id===chapter.location)?.name || 'Punjab · no city pin';
        button.append(date,title,company,place);button.addEventListener('click',()=>{stopTour();selectChapter(chapter);});return button;
    }));
    document.querySelectorAll('[data-place]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.place===(placeFilter||'all'))));
    const active = $('chapterList').querySelector('[aria-pressed="true"]');
    if (active) {
        const listRect = $('chapterList').getBoundingClientRect(), activeRect = active.getBoundingClientRect();
        if (activeRect.top < listRect.top || activeRect.bottom > listRect.bottom) $('chapterList').scrollTop += activeRect.top - listRect.top;
    }
}
function selectChapter(chapter, fly=true) {
    selected=chapter;renderList();
    const place=locations.find(l=>l.id===chapter.location);
    $('chapterDetail').innerHTML=`<div><p class="eyebrow">${chapter.type==='work'?'CAREER CHAPTER':'EDUCATION'} / ${place?place.name.toUpperCase()+' · '+place.country.toUpperCase():'PUNJAB · INDIA'}</p><h2>${chapter.title}<br>${chapter.subtitle}</h2><div class="detail-meta">${chapter.company}<br>${chapter.date}</div></div><div class="detail-copy"><p>${chapter.copy}</p><div class="detail-tags">${chapter.tags.map(tag=>`<span>${tag}</span>`).join('')}</div></div>`;
    if(globe) { globe.select(chapter.location,fly); }
}
function selectPlace(id) {
    stopTour();placeFilter=id==='all'?null:id;
    const chapter=chapters.find(c=>(filter==='all'||c.type===filter)&&(!placeFilter||c.location===placeFilter));
    if(chapter) selectChapter(chapter);else {renderList();$('chapterList').textContent='No chapters in this category at this location.';}
}
for(const place of [{id:'all',name:'Everywhere'},...locations]) {
    const button=document.createElement('button');button.textContent=place.name;button.dataset.place=place.id;button.setAttribute('aria-pressed',String(place.id==='all'));button.addEventListener('click',()=>selectPlace(place.id));$('locationSelector').append(button);
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    stopTour();filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const chapter=chapters.find(c=>(filter==='all'||c.type===filter)&&(!placeFilter||c.location===placeFilter));
    if(chapter) selectChapter(chapter);else {$('chapterList').textContent='No chapters in this category at this location.';}
}));
$('tourToggle').addEventListener('click',()=>{
    if(tourTimer!==null) {stopTour();return;}
    filter='work';placeFilter=null;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='work')));
    tourIndex=0;$('tourToggle').setAttribute('aria-pressed','true');$('tourToggle').textContent='■ Stop career tour';
    function step() {selectChapter(tourChapters[tourIndex]);tourIndex++;if(tourIndex<tourChapters.length)tourTimer=setTimeout(step,5500);else tourTimer=setTimeout(stopTour,5500);}
    step();
});
document.addEventListener('keydown',event=>{if(event.key==='Escape')stopTour();});
selectChapter(selected);
async function createGlobe() {
    const THREE=await import('three');const {OrbitControls}=await import('three/addons/controls/OrbitControls.js');
    const viewport=$('globeViewport');
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);viewport.prepend(renderer.domElement);
    const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(0,0,3.7);
    const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=!reduced.matches;controls.dampingFactor=.06;controls.minDistance=1.65;controls.maxDistance=5.6;controls.autoRotateSpeed=.45;controls.rotateSpeed=.5;controls.zoomSpeed=.6;
    scene.add(new THREE.AmbientLight(0x91b9dc,1.8));const light=new THREE.DirectionalLight(0xc5e7ff,2.4);light.position.set(-3,4,5);scene.add(light);
    const world=new THREE.Group();scene.add(world);
    const earth=new THREE.Mesh(new THREE.SphereGeometry(1,96,64),new THREE.MeshPhongMaterial({color:0x12334b,shininess:28,specular:0x235275}));world.add(earth);
    // Fresnel shell: a view-dependent glow rather than an opaque outer sphere.
    const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.035,64,48),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false,uniforms:{glowColor:{value:new THREE.Color(0x39a4ff)}},vertexShader:'varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}',fragmentShader:'uniform vec3 glowColor; varying vec3 vNormal; varying vec3 vPosition; void main(){float edge=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),3.0);gl_FragColor=vec4(glowColor,edge*0.65);}'}));world.add(atmosphere);
    const vector=(lat,lon,r=1)=>new THREE.Vector3(r*Math.cos(lat*Math.PI/180)*Math.cos(lon*Math.PI/180),r*Math.sin(lat*Math.PI/180),-r*Math.cos(lat*Math.PI/180)*Math.sin(lon*Math.PI/180));
    const grid=new THREE.Group();
    for(let lat=-60;lat<=60;lat+=30) {const points=[];for(let lon=-180;lon<=180;lon+=3)points.push(vector(lat,lon,1.003));grid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x36556c,transparent:true,opacity:.24})));}
    for(let lon=-180;lon<180;lon+=30) {const points=[];for(let lat=-90;lat<=90;lat+=3)points.push(vector(lat,lon,1.003));grid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x36556c,transparent:true,opacity:.2})));}world.add(grid);
    const starPositions=[];for(let i=0;i<750;i++){const direction=new THREE.Vector3(Math.sin(i*12.98),Math.cos(i*4.73),Math.sin(i*7.31)).normalize().multiplyScalar(12+(i%9));starPositions.push(direction.x,direction.y,direction.z);}
    const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));scene.add(new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0x90b5d6,size:.016,transparent:true,opacity:.65,sizeAttenuation:true})));
    const markers=[],labels=[];
    for(const place of locations) {
        const position=vector(place.lat,place.lon,1.025);const marker=new THREE.Mesh(new THREE.SphereGeometry(.016,16,12),new THREE.MeshBasicMaterial({color:0x69b5ff}));marker.position.copy(position);marker.userData.place=place.id;world.add(marker);
        const hit=new THREE.Mesh(new THREE.SphereGeometry(.034,12,8),new THREE.MeshBasicMaterial({visible:false}));hit.position.copy(position);hit.userData.place=place.id;world.add(hit);
        const ring=new THREE.Mesh(new THREE.RingGeometry(.027,.032,40),new THREE.MeshBasicMaterial({color:0x6be2c5,side:THREE.DoubleSide,transparent:true,opacity:.8,depthWrite:false}));ring.position.copy(vector(place.lat,place.lon,1.016));ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),position.clone().normalize());world.add(ring);
        const label=document.createElement('span');label.className='map-label';label.textContent=place.name;$('globeLabels').append(label);labels.push({label,place,position});markers.push({marker,hit,ring,place});
    }
    const routes=new THREE.Group();world.add(routes);const travelers=[];
    function addRoute(from,to,height) {const a=vector(from.lat,from.lon),b=vector(to.lat,to.lon);const curvePoints=[];for(let i=0;i<=100;i++){const t=i/100;curvePoints.push(a.clone().lerp(b,t).normalize().multiplyScalar(1.025+Math.sin(t*Math.PI)*height));}const curve=new THREE.CatmullRomCurve3(curvePoints);routes.add(new THREE.Mesh(new THREE.TubeGeometry(curve,120,.002,6,false),new THREE.MeshBasicMaterial({color:0x6be2c5,transparent:true,opacity:.75})));const traveler=new THREE.Mesh(new THREE.SphereGeometry(.008,12,8),new THREE.MeshBasicMaterial({color:0xd3fff1}));routes.add(traveler);travelers.push({traveler,curve});}
    addRoute(locations[2],locations[1],.42);addRoute(locations[1],locations[0],.1);
    let flight=null,selectedPlace=selected.location,autoRotate=false,frame=null,visible=true,lastTime=0;
    function flyTo(place,distance=3.25) {const destination=vector(place.lat,place.lon,distance);if(reduced.matches){camera.position.copy(destination);controls.update();}else flight={from:camera.position.clone().normalize(),rotation:new THREE.Quaternion().setFromUnitVectors(camera.position.clone().normalize(),destination.clone().normalize()),radius:camera.position.length(),distance,start:performance.now()};}
    function select(id,fly=true){selectedPlace=id;for(const m of markers)m.marker.material.color.set(m.place.id===id?0x6be2c5:0x69b5ff);const place=locations.find(l=>l.id===id);if(place&&fly)flyTo(place);}
    function resize(){const rect=viewport.getBoundingClientRect();renderer.setSize(rect.width,rect.height);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();draw(performance.now());}new ResizeObserver(resize).observe(viewport);
    function projectLabels(){for(const {label,place,position} of labels){const point=position.clone().project(camera);const front=position.dot(camera.position)>1.04;const crowded=place.id==='scarborough'&&selectedPlace!=='scarborough'&&camera.position.length()>2.5;label.hidden=!front||crowded||Math.abs(point.x)>1||Math.abs(point.y)>1;label.classList.toggle('selected',place.id===selectedPlace);label.style.left=`${(point.x*.5+.5)*viewport.clientWidth}px`;label.style.top=`${(-point.y*.5+.5)*viewport.clientHeight}px`;}}
    function draw(now){if(flight){const t=Math.min(1,(now-flight.start)/1400);const ease=t*t*(3-2*t);camera.position.copy(flight.from).applyQuaternion(new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion(),flight.rotation,ease)).multiplyScalar(THREE.MathUtils.lerp(flight.radius,flight.distance,ease));if(t===1)flight=null;}controls.autoRotate=autoRotate&&!flight&&!reduced.matches;controls.update();for(const {ring,place} of markers){const wave=reduced.matches?0:((now/1800)%1);ring.scale.setScalar(place.id===selectedPlace?1+wave*1.8:1);ring.material.opacity=place.id===selectedPlace?(.8-wave*.55):.3;}for(const {traveler,curve} of travelers)traveler.position.copy(curve.getPointAt(reduced.matches?.5:(now/6500)%1));renderer.render(scene,camera);projectLabels();}
    function tick(now){frame=null;if(!visible)return;if(now-lastTime>1000/40){draw(now);lastTime=now;}if(!reduced.matches||flight)frame=requestAnimationFrame(tick);}
    function wake(){if(frame===null&&visible)frame=requestAnimationFrame(tick);}
    controls.addEventListener('change',()=>{if(reduced.matches) {renderer.render(scene,camera);projectLabels();}});
    controls.addEventListener('start',()=>{flight=null;stopTour();wake();});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&!document.hidden;if(visible)wake();else {cancelAnimationFrame(frame);frame=null;}},{threshold:0}).observe(viewport);
    document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)wake();else{cancelAnimationFrame(frame);frame=null;stopTour();}});
    reduced.addEventListener('change',()=>{controls.enableDamping=!reduced.matches;wake();draw(performance.now());});
    const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();let pointerStart=null;
    function hitAt(event){const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects([earth,...markers.map(m=>m.hit)])[0]?.object.userData.place;}
    renderer.domElement.addEventListener('pointerdown',event=>{pointerStart=[event.clientX,event.clientY];});renderer.domElement.addEventListener('pointerup',event=>{if(!pointerStart||Math.hypot(event.clientX-pointerStart[0],event.clientY-pointerStart[1])>6)return;const id=hitAt(event);if(id)selectPlace(id);});
    renderer.domElement.addEventListener('pointermove',event=>{const id=hitAt(event);renderer.domElement.style.cursor=id?'pointer':'grab';$('globeTooltip').hidden=!id;if(id)$('globeTooltip').textContent=locations.find(l=>l.id===id).name+' · Select to explore';});renderer.domElement.addEventListener('pointerleave',()=>{$('globeTooltip').hidden=true;});
    viewport.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();flight=null;stopTour();const spherical=new THREE.Spherical().setFromVector3(camera.position);spherical.theta+=event.key==='ArrowLeft'?.15:event.key==='ArrowRight'?-.15:0;spherical.phi+=event.key==='ArrowUp'?-.12:event.key==='ArrowDown'?.12:0;spherical.makeSafe();camera.position.setFromSpherical(spherical);controls.update();draw(performance.now());}if(event.key==='+'||event.key==='=')zoom(.85);if(event.key==='-')zoom(1.15);});
    function zoom(factor){flight=null;camera.position.setLength(THREE.MathUtils.clamp(camera.position.length()*factor,controls.minDistance,controls.maxDistance));controls.update();draw(performance.now());}
    $('zoomIn').addEventListener('click',()=>zoom(.85));$('zoomOut').addEventListener('click',()=>zoom(1.15));
    $('rotateToggle').addEventListener('click',()=>{autoRotate=!autoRotate;$('rotateToggle').setAttribute('aria-pressed',String(autoRotate));$('rotateToggle').textContent=autoRotate?'Ⅱ Pause rotation':'↻ Auto rotate';if(reduced.matches&&autoRotate){$('rotateToggle').textContent='Motion reduced';autoRotate=false;$('rotateToggle').setAttribute('aria-pressed','false');}wake();});
    $('routeToggle').addEventListener('click',()=>{routes.visible=!routes.visible;$('routeToggle').setAttribute('aria-pressed',String(routes.visible));draw(performance.now());});
    $('resetView').addEventListener('click',()=>{stopTour();autoRotate=false;$('rotateToggle').setAttribute('aria-pressed','false');$('rotateToggle').textContent='↻ Auto rotate';flyTo(locations.find(l=>l.id===selectedPlace)||locations[0],3.7);wake();});
    globe={select:(id,fly)=>{select(id,fly);draw(performance.now());wake();}};select(selected.location);resize();wake();$('globeLoading').hidden=true;$('mapState').textContent='3 LOCATIONS / 10 CHAPTERS';
    try {
        const response=await fetch('assets/globe/countries.geojson');if(!response.ok)throw Error('Map unavailable');const geo=await response.json();
        const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;const ctx=canvas.getContext('2d');ctx.fillStyle='#081d30';ctx.fillRect(0,0,canvas.width,canvas.height);
        const edges=[];
        for(const feature of geo.features){const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;
            for(const polygon of polygons){ctx.beginPath();for(const ring of polygon){ring.forEach(([lon,lat],i)=>{const x=(lon+180)/360*canvas.width,y=(90-lat)/180*canvas.height;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();for(let i=1;i<ring.length;i++){const [lon,lat]=ring[i],prev=ring[i-1];if(Math.abs(lon-prev[0])>180)continue;const a=vector(prev[1],prev[0],1.006),b=vector(lat,lon,1.006);edges.push(a.x,a.y,a.z,b.x,b.y,b.z);}}ctx.fillStyle=feature.properties.ADMIN==='Canada'?'#23516c':feature.properties.ADMIN==='India'?'#23596a':'#16394c';ctx.fill('evenodd');ctx.strokeStyle='#2e5d76';ctx.lineWidth=.6;ctx.stroke();}
        }
        const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());earth.material.map=texture;earth.material.color.set(0xffffff);earth.material.needsUpdate=true;
        const boundaries=new THREE.BufferGeometry();boundaries.setAttribute('position',new THREE.Float32BufferAttribute(edges,3));world.add(new THREE.LineSegments(boundaries,new THREE.LineBasicMaterial({color:0x478aac,transparent:true,opacity:.3})));draw(performance.now());
    } catch(error){$('mapState').textContent='BORDERS UNAVAILABLE · GLOBE READY';console.warn(error);}
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=null;$('globeLoading').hidden=false;$('globeLoading').textContent='The 3D view was interrupted. Reload to restore it; all career chapters remain available.';});
}
createGlobe().catch(error=>{
    console.error(error);$('mapState').textContent='CHAPTER EXPLORER';$('globeLoading').textContent='The 3D globe could not load on this device. Explore every location and career chapter using the controls alongside it.';
    document.querySelectorAll('.globe-toolbar button').forEach(button=>{button.disabled=true;});
});
