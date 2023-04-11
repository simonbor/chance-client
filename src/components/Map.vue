
<template>
  <div>
    <div id="map">
      <div id="mapContainer" ref="hereMap"></div>
    </div>
    <MapButtons @clicked="onClickChild"/>
  </div>
</template>

<script>
  import MapButtons from '@/components/MapButtons';
  const moment = require('moment');
  const config = require('config');
  let map, maptypes, group, ui;

  const markerEye = `<svg width="55px" height="55px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#ff3d00" d="M24,4c-7.732,0-14,6.269-14,14c0,7.732,14,26,14,26s14-18.268,14-26C38,10.269,31.732,4,24,4z"></path>
    <path fill="#eceff1" d="M24 9A9 9 0 1 0 24 27A9 9 0 1 0 24 9Z"></path><path fill="#2196f3" d="M24 12A6 6 0 1 0 24 24A6 6 0 1 0 24 12Z"></path>
    <path fill="#263238" d="M24 15A3 3 0 1 0 24 21A3 3 0 1 0 24 15Z"></path><path fill="#eceff1" d="M26 15A1 1 0 1 0 26 17A1 1 0 1 0 26 15Z"></path></svg>`;
  const markerRed = `<svg width="55px" height="55px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <path fill="#f78f8f" d="M19.999,38.251C17.896,35.874,7.5,23.628,7.5,14C7.5,7.107,13.107,1.5,20,1.5S32.5,7.107,32.5,14 C32.5,23.58,22.102,35.866,19.999,38.251z"></path>
  <path fill="#c74343" d="M20,2c6.617,0,12,5.383,12,12c0,8.932-9.29,20.349-12.001,23.491C17.286,34.358,8,22.977,8,14 C8,7.383,13.383,2,20,2 M20,1C12.82,1,7,6.82,7,14c0,10.981,13,25,13,25s13-14.074,13-25C33,6.82,27.18,1,20,1L20,1z"></path><g>
  <path fill="#f2faff" d="M20,19.5c-3.032,0-5.5-2.467-5.5-5.5s2.468-5.5,5.5-5.5s5.5,2.467,5.5,5.5S23.032,19.5,20,19.5z"></path>
  <path fill="#c74343" d="M20,9c2.761,0,5,2.239,5,5s-2.239,5-5,5s-5-2.239-5-5S17.239,9,20,9 M20,8c-3.308,0-6,2.692-6,6 s2.692,6,6,6s6-2.692,6-6S23.308,8,20,8L20,8z"></path></g></svg>`;
  const markerGreen = `<svg width="55px" height="55px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <path fill="#1fb141" d="M19.999,38.251C17.896,35.874,7.5,23.628,7.5,14C7.5,7.107,13.107,1.5,20,1.5S32.5,7.107,32.5,14 C32.5,23.58,22.102,35.866,19.999,38.251z"></path>
  <path fill="#116725" d="M20,2c6.617,0,12,5.383,12,12c0,8.932-9.29,20.349-12.001,23.491C17.286,34.358,8,22.977,8,14 C8,7.383,13.383,2,20,2 M20,1C12.82,1,7,6.82,7,14c0,10.981,13,25,13,25s13-14.074,13-25C33,6.82,27.18,1,20,1L20,1z"></path><g>
  <path fill="#f2faff" d="M20,19.5c-3.032,0-5.5-2.467-5.5-5.5s2.468-5.5,5.5-5.5s5.5,2.467,5.5,5.5S23.032,19.5,20,19.5z"></path>
  <path fill="#116725" d="M20,9c2.761,0,5,2.239,5,5s-2.239,5-5,5s-5-2.239-5-5S17.239,9,20,9 M20,8c-3.308,0-6,2.692-6,6 s2.692,6,6,6s6-2.692,6-6S23.308,8,20,8L20,8z"></path></g></svg>`;

  export default {
    name: "Map",
    components: {
      MapButtons
    },
    data() {
      return {
        platform: null,
        apikey: "LdLTg5x1C7ZrQwpfHlYB6NwfpX2mQGEp5uxVH8AJNBU"
      };
    },
    async mounted() {
      // Initialize the platform object:
      const platform = new window.H.service.Platform({
        apikey: this.apikey
      });
      this.platform = platform;

      const mapContainer = this.$refs.hereMap;
      const H = window.H;

      // Obtain the default map types from the platform object
      maptypes = this.platform.createDefaultLayers();
      maptypes.vector.normal.map.setMax(19);

      // Instantiate (and display) a map object:
      map = new H.Map(mapContainer, maptypes.vector.normal.map, {
        zoom: 15,
        center: { lat: 32.0758, lng: 34.7722 }
      });
      group = new H.map.Group();

      // add behavior control
      const mapEvents = new H.mapevents.MapEvents(map);
      new H.mapevents.Behavior(mapEvents);

      // add UI
      ui = H.ui.UI.createDefault(map, maptypes);
    },
    methods: {
      onClickChild (locations) {
        this.initializeHereMap(locations);
      },
      initializeHereMap(locations) {
        const markers = [];

        locations.map(loc => {
          const currentTime = Date.now();
          const markerTime = new Date(loc.DateStart).getTime();
          let icon = new H.map.Icon(markerGreen);
          
          if((markerTime - (1000 * 60 * 5)) > currentTime) {
            icon = new H.map.Icon(markerRed);
          }

          const marker = new H.map.Marker(loc, {icon: icon});
          const html = `<div class='chance-map'><ul>
            <li><a href='//waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes&zoom=9'>Leaving time:</a></li>
            <li><a href='//waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes&zoom=9'>${moment(loc.DateStart).fromNow()}</a></li>
            <li><a href='//waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes&zoom=9'><span>Take me there!</span></a></li></ul>
            <input type="hidden" value="${loc.DateStart}" /></div>`;

          // const html = `<div class='chance-map'><span>Go with:</span><ul>
          //   <li><a href='//waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes&zoom=9'>waze</a></li>
          //   <li><a href='//maps.apple.com/?ll=${loc.lat},${loc.lng}"'>apple maps</a></li>
          //   <li><a href='//maps.google.com/maps?q=${loc.lat},${loc.lng}'>google maps</a></li></ul></div>`;

          marker.setData(html);
          markers.push(marker);
        })

        group.removeAll();
        if(markers.length > 0) {  // prevent here map client error
          group.addObjects(markers);
          map.addObject(group);

          group.addEventListener('tap', function (evt) {
            var bubble =  new H.ui.InfoBubble(evt.target.getGeometry(), {
              content: evt.target.getData()
            });
            ui.getBubbles().forEach(bub => ui.removeBubble(bub)); //remove other infobubbles
            ui.addBubble(bubble); // show info bubble
          }, false);

          // get geo bounding box for the group and set it to the map ( centralizing )
          map.getViewModel().setLookAtData({
            bounds: group.getBoundingBox()
          });
        }

        addEventListener("resize", () => map.getViewPort().resize());
      }
    }
  };
</script>

<style>
  .chance-map { text-align: center; font-size: large; }
  .chance-map span { font-weight: bold; border-bottom-style: solid; border-width: 1px; border-bottom-color:rgba(15, 22, 23, .8); }
  .chance-map ul { padding: 0; margin: 0; margin-top: 3px; list-style-type: none; line-height: 19px; }
  .chance-map ul li { text-align: center; }
  .chance-map ul li a { text-decoration: none; color: rgba(15, 22, 23, .8); font-size: large; line-height: 30px; }
  .H_ib_body { width: 190px; }
</style>

<style scoped>
  #map {
    text-align: center;
    margin: 10px auto;
    background-color: #ccc;
  }
  #mapContainer {
    height: 475px;
  }
</style>