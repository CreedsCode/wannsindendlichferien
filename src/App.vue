<template>
  <div id="app"  >
   
  
<b-container  >
    <b-row  >
      <b-col cols="1"></b-col>
          <b-col cols="10">
           
            <h1>Wann sind wieder Ferien</h1>
            <br>
            
            <transition :duration="1000" name="fade"> 
              <b-form-select v-on:change="activate" v-if="!isHidden"  v-model="selected" :options="options"  class="mb-4" />
            </transition>
            
              <b><transition :duration="1000" name="fade"> <p v-if="show"> Bis zum Anfang der {{timerhollyday}}</p></transition></b>
            
        </b-col>
        <b-col cols="1"></b-col>
        </b-row> 
         </b-container>
        <b-container>
          
        <b-row align-v="start" class="justify-content-center">
          <transition :duration="1000" name="fade">
            <b-col md="auto"  v-if="show" >
              <h2>{{this.countdowntext.d}} Tage</h2>
            </b-col>
          </transition>
          <transition :duration="1000" name="fade">
            <b-col md="auto" v-if="show" >
              <h2>{{this.countdowntext.h}} Stunden</h2>  
            </b-col>
          </transition>
          <transition :duration="1000" name="fade">
            <b-col md="auto" v-if="show"  >
              <h2>{{this.countdowntext.m}} Minuten</h2>
            </b-col>
          </transition>
          <transition :duration="1000" name="fade">
            <b-col md="auto" v-if="show" >
              <h2>{{this.countdowntext.s}} Sekunden</h2>
            </b-col>
          </transition>
        </b-row>
      
        </b-container>
       <br>
    <b-container>
      <transition :duration="1000" name="fade">
      <b-button v-on:click="reset" v-if="show" variant="primary">Bundesland wechseln</b-button>
      </transition>
    </b-container>
    <br>
    <br>
    <footer id="footer">
     
        <b-container>
    
    <b-row align-v="center">
        
        <b-col> <div>
       <b-card bg-variant="info"
                text-variant="white"
                header="powered by"
                class="text-center">
            <p class="card-text"><a href="https://robin.meis.space/2014/04/15/ferien-feiertag-api-fuer-deutschland/">Ferien / Feiertag API von Robin Meis</a></p>
        </b-card>
    </div></b-col>
        
    </b-row>
    </b-container>
    </footer>
     
   
       
     
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "app",
  data() {
    return {
      show: false,
      isHidden: false,
      timerhollyday: null,
      timer: null,
      countdownstate: false,
      countdowntext: {
        d: null,
        h: null,
        m: null,
        s: null
      },
      currentdaystamp: null,
      timestampsstart: [],
      timestampend: [],
      ferienname: [],
      selected: null,
      apiurl: "https://api.smartnoob.de/ferien/v1/ferien/?bundesland=",
      options: [
        { value: null, text: "Wähle dein Bundesland" },
        { value: "BW", text: "Baden-Württemberg" },
        { value: "BY", text: "Bayern" },
        { value: "BE", text: "Berlin" },
        { value: "BB", text: "Brandenburg" },
        { value: "HB", text: "Bremen" },
        { value: "HH", text: "Hamburg" },
        { value: "HE", text: "Hessen" },
        { value: "MV", text: "Mecklenburg-Vorpommern" },
        { value: "NI", text: "Niedersachsen" },
        { value: "NW", text: "Nordrhein-Westfalen" },
        { value: "RP", text: "Rheinland-Pfalz" },
        { value: "SL", text: "Saarland" },
        { value: "SN", text: "Sachsen" },
        { value: "ST", text: "Sachsen-Anhalt" },
        { value: "SH", text: "Schleswig-Holstein" },
        { value: "TH", text: "Thüringen" }
      ]
    };
  },
  watch: {
    selected: function() {
      axios
        .get(`${this.apiurl}${this.selected}`)
        .then(
          function(response) {
            for (var i = 0; i < response.data.daten.length; i++) {
              if (response.data.daten[i].beginn > this.currentdaystamp) {
                this.timestampsstart.push(response.data.daten[i].beginn);
                this.ferienname.push(response.data.daten[i].title);
                this.timestampend.push(response.data.daten[i].ende);
              }
            }
            this.timerhollyday = this.cuthollydays();
            this.timer = setInterval(this.showRemainingto, 1000);
          }.bind(this)
        )
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  methods: {
    activate() {
      setTimeout(() => (this.isHidden = true), 10);
      setTimeout(() => (this.show = true), 1520);
    },
    reset: function() {
      location.reload();
    },
    cuthollydays: function() {
      return this.ferienname[0].split(" ", 1)[0];
    },
    showRemainingto: function() {
      this.countdownstate = true;
      var _second = 1000;
      var _minute = _second * 60;
      var _hour = _minute * 60;
      var _day = _hour * 24;

      this.distance =
        new Date(this.timestampsstart[0] * 1e3) -
        new Date(Math.floor(Date.now()));

      if (this.distance < 0) {
        clearInterval(this.timer);
        this.countdownstate = false;
        this.reset();
        return;
      }
      var days = Math.floor(this.distance / _day);
      var hours = Math.floor((this.distance % _day) / _hour);
      var minutes = Math.floor((this.distance % _hour) / _minute);
      var seconds = Math.floor((this.distance % _minute) / _second);

      this.countdowntext.d = days;
      this.countdowntext.h = hours;
      this.countdowntext.m = minutes;
      this.countdowntext.s = seconds;
    }
  },
  created: function() {
    this.currentdaystamp = Math.floor(Date.now() / 1000);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
