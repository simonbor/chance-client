
<template>
  <div id="map">
    <div id="mapContainer" style="height:600px;width:100%" ref="hereMap"></div>
  </div>
</template>

<script>
export default {
  name: "HereMapLocations",
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

    const locations = [
      { lat: 48.8567, lng: 2.3508 },
      { lat: 41.9, lng: 12.5 },
      { lat: 52.5166, lng: 13.3833 },
      { lat: 40.4, lng: -3.6833 },
      { lat: 51.5008, lng: -0.1224 }
    ];

    this.initializeHereMap(locations);
  },
  methods: {
    initializeHereMap(locations) {

      const mapContainer = this.$refs.hereMap;
      const H = window.H;
      // Obtain the default map types from the platform object
      var maptypes = this.platform.createDefaultLayers();

      // Instantiate (and display) a map object:
      var map = new H.Map(mapContainer, maptypes.vector.normal.map, {
          zoom: 4,
        // center: this.center
        center: { lat: 50, lng: 5 }
      });

      locations.map(loc => {
        var parisMarker = new H.map.Marker(loc);
        map.addObject(parisMarker);
      })

      addEventListener("resize", () => map.getViewPort().resize());

      // add behavior control
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      // add UI
      H.ui.UI.createDefault(map, maptypes);
    }
  }
};
</script>

<style scoped>
#map {
  width: 60vw;
  min-width: 360px;
  text-align: center;
  margin: 5% auto;
  background-color: #ccc;
}
</style>