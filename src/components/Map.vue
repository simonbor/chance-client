
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
  const config = require('config');
  let map, maptypes, group, ui;

  export default {
    name: "Map",
    components: {
      MapButtons
    },
    data() {
      return {
        platform: null,
        apikey: "jMoxIpkNNj0aZNL1xVxGqPnsZ9sYLG7Zw5Q1FMRfd1s"
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
          const marker = new H.map.Marker(loc);
          const html = `<div class='chance-map'><span>Go with:</span><ul>
            <li><a href='//waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes&zoom=9'>waze</a></li>
            <li><a href='//maps.apple.com/?ll=${loc.lat},${loc.lng}"'>apple maps</a></li>
            <li><a href='//maps.google.com/maps?q=${loc.lat},${loc.lng}'>google maps</a></li></div>`;

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
  .chance-map { text-align: center; font-size: x-large; }
  .chance-map span { font-weight: bold; border-bottom-style: solid; border-width: 1px; border-bottom-color:rgba(15, 22, 23, .8); }
  .chance-map ul { padding: 0; margin: 0; margin-top: 3px; list-style-type: none; line-height: 19px; }
  .chance-map ul li { text-align: center; }
  .chance-map ul li a { text-decoration: none; color: rgba(15, 22, 23, .8); font-size: x-large; line-height: 30px; }
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