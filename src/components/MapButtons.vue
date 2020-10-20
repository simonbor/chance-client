<template>
  <div>
    <b-button-group size="lg">
      <b-button v-on:click="fiveMinutesGap(5)">5</b-button>
      <b-button v-on:click="fiveMinutesGap(15)">15</b-button>
      <b-button v-on:click="fiveMinutesGap(45)">45</b-button>
    </b-button-group>
  </div>
</template>

<style scoped>
</style>

<script>
const config = require('config');

export default {
    mounted() {
      setTimeout(()=>{
        this.fiveMinutesGap(30);
      }, 2000);
    },
    methods: {
        async fiveMinutesGap (mins) {
            const secs = mins * 1000 * 60;
            const dateStart = (new Date(Date.now() - secs)).toLocaleString("en-US");

            const response = await fetch(`${config.apiUrl}/chance-list`,
            {
              method: 'post',
              headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
              },
              body: JSON.stringify({"Address": {"CityId": 1}, "Chance": {"DateStart": dateStart}})
            });
            response.json = await response.json();

            if(!response.ok && response.json.statusCode === 401) {
              console.log(response.json.statusText);
              this.logOff();
            }

            const locations = [];
            response.json.data.map(chance => {
                if (chance.Longitude != null && chance.Latitude != null) {
                    locations.push({ lat: chance.Latitude, lng: chance.Longitude });
                }
            });

            this.$emit('clicked', locations);
        }
    }
}
</script>