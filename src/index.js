const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const port = 80;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Mattermost API Tokens
const POST_WEATHER_TOKEN = process.env.POST_WEATHER_TOKEN;
const GET_WEATHER_TOKEN = process.env.GET_WEATHER_TOKEN;

// API Keys
const SECRET_OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

function fetchWeather(zipcode, res) {
  fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&APPID=${SECRET_OPENWEATHERMAP_API_KEY}&units=imperial`)
    .then(response => checkStatus(response))
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const retString = `## Weather in ${data.name} is currently: ` +
                        data.weather.map((weather_data, key) => key > 1 ? ' and ' : '' + weather_data.description) + '\n' +
                        `### Wind speeds: ${data.wind.speed} mi/h at ${data.wind.deg} degrees ` +
                        `with ${data.clouds.all * 100}% clouds and ${data.main.humidity}% humidity\n\n` +
                        `|            | Temperature                |\n` +
                        `|:-----------|----------------------------|\n` +
                        `| Currently  | ${data.main.temp} °F       |\n` +
                        `| Feels Like | ${data.main.feels_like} °F |\n` +
                        `| High       | ${data.main.temp_max} °F   |\n` +
                        `| Low        | ${data.main.temp_min} °F   |\n`;

      res.set('Content-Type', 'application/json');
      res.send({
        "response_type": "ephemeral",
        "text": retString
      });
    })
    .catch(error => {
      console.error(error);
      res.set('Content-Type', 'application/json');
      res.send({
        "text": `${error}`
      });
    });
}

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    let err = new Error(res.statusText);
    err.response = res;
    throw err;
  }
}

app.post('/weather', (req, res) => {
  try {
    // authenticate Mattermost token
    const reqToken = req.header('authorization').replace('Token ', '').trim();
    if(reqToken.localeCompare(POST_WEATHER_TOKEN) != 0) {
      let err = new Error("Incorrect Mattermost API Token");
      err.response = res;
      throw err;
    }

    // test query zipcode is valid using regex
    const zipcode = req.body.text.trim() === "" ? 45469 : req.body.text.trim();
    if(/^[0-9]{5}(?:-[0-9]{4})?$/.test(zipcode)){
      fetchWeather(parseInt(zipcode), res);
    } else {
      let err = new Error("Incorrect Zipcode Format Provided");
      err.response = res;
      throw err;
    }
  }
  catch(error) {
    console.error(error);
    res.set('Content-Type', 'application/json');
    res.send({
      "text": `${error}`
    });
  }
})

app.get('/weather', (req, res) => {
  try {
    // authenticate Mattermost token
    const reqToken = req.header('authorization').replace('Token ', '').trim();
    if(reqToken.localeCompare(GET_WEATHER_TOKEN) != 0) {
      let err = new Error("Incorrect Mattermost API Token");
      err.response = res;
      throw err;
    }

    // get weather defaulted to 45469
    fetchWeather(45469, res);

    }
    catch(error) {
      console.error(error);
      res.set('Content-Type', 'application/json');
      res.send({
        "text": `${error}`
      });
    }
});

app.listen(port, () => console.log(`MM-Slash app is listening on port ${port}`));
