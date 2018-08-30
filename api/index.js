const fs = require("fs-extra");
const axios = require("axios");

const url = "https://api.smartnoob.de/ferien/v1/ferien/?bundesland=";
const bundesland = [
  "BW",
  "BY",
  "BE",
  "BB",
  "HB",
  "HH",
  "HE",
  "MV",
  "NI",
  "NW",
  "RP",
  "SL",
  "SN",
  "ST",
  "SH",
  "TH"
];
const db = {};
console.log("remove old");
fs.remove("./db.json")
  .then(() => {
    console.log("success!");
    console.log("get the data from api");
    bundesland.forEach(element => {
      axios
        .get(`${url}${element}`)
        .then(function(response) {
          // handle success
          db[element] = response.data;
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .then(function() {
          fs.writeJson("./db.json", db)
            .then(() => {
              console.log("success!");
            })
            .catch(err => {
              console.error(err);
            });
        });
    });
  })
  .catch(err => {
    console.error(err);
  });
