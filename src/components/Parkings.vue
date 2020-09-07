
<template>
  <div id="map">
    <div id="mapContainer" style="height:600px;width:100%" ref="hereMap"></div>
  </div>
</template>

<script>
export default {
  name: "Parkings",
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

    const respone = await this.$http.post('https://chance-app.herokuapp.com/chance-list', {"Address": {"CityId": 1}, "Chance": {}});
    // const respone = await this.$http.post('https://chance-app.herokuapp.com/chance-list', {"Address": {"CityId": 1},	"Chance": {"DateStart": "2020-09-07 17:00:00"}});

    const locations = [];

    respone.data.map(chance => {
      if (chance.Longitude != null && chance.Latitude != null) {
        locations.push({ lat: chance.Latitude, lng: chance.Longitude });
      }
    })

    this.initializeHereMap(locations);
  },
  methods: {
    initializeHereMap(locations) {
      const mapContainer = this.$refs.hereMap;
      const H = window.H;
      // Obtain the default map types from the platform object
      var maptypes = this.platform.createDefaultLayers();
      maptypes.vector.normal.map.setMax(16.5);

      // Instantiate (and display) a map object:
      var map = new H.Map(mapContainer, maptypes.vector.normal.map, {
        zoom: 15,
        center: { lat: 32.0758, lng: 34.7722 }
      });

      const markers = [];
      const group = new H.map.Group();
      locations.map(loc => {
        markers.push(new H.map.Marker(loc));
      })

      // add markers to the group
      group.addObjects(markers);
      map.addObject(group);

      // get geo bounding box for the group and set it to the map ( centralizing )
      map.getViewModel().setLookAtData({
        bounds: group.getBoundingBox()
      });

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