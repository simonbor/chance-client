
<template>
  <div id="map">
    <div id="mapContainer" style="height:600px;width:100%" ref="hereMap"></div>
  </div>
</template>

<script>
export default {
  name: "HereMap",
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
    this.initializeGeocoder();
  },
  methods: {
    onError(error) {
        console.log('Can\'t reach the remote server');
    },
    onSuccess(result) {
        this.initializeHereMap(result.items);
    },
    initializeGeocoder() {
        var geocoder = this.platform.getSearchService(),
            geocodingParameters = {
             qq: 'houseNumber=5;street=שלום אליכם;city=תל אביב;country=ישראל',
            };

        geocoder.geocode(geocodingParameters, this.onSuccess, this.onError);
    },
    initializeHereMap(locations) { // rendering map

      const mapContainer = this.$refs.hereMap;
      const H = window.H;
      // Obtain the default map types from the platform object
      var maptypes = this.platform.createDefaultLayers();

      // Instantiate (and display) a map object:
      var map = new H.Map(mapContainer, maptypes.vector.normal.map, {
          zoom: 15,
        // center: this.center
        center: { lat: 32.0758, lng: 34.7722 }
      });

    for (let i = 0;  i < locations.length; i += 1) {
        let location = locations[i];
        let marker = new H.map.Marker(location.position);
        marker.label = location.address.label;
        map.addObject(marker);
    }

    var ui = H.ui.UI.createDefault(map, maptypes);
    var bubble;
    map.addEventListener('tap', function (evt) {
            function openBubble(position, text) {
                if(!bubble){
                    bubble =  new H.ui.InfoBubble(position, {content: text});
                    ui.addBubble(bubble);
                } else {
                    bubble.setPosition(position);
                    bubble.setContent(text);
                    bubble.open();
                }
            };

            // map.setCenter(evt.target.getGeometry());
            openBubble(evt.target.getGeometry(), evt.target.label);
        }, false);

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