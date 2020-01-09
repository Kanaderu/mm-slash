const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 80;

//const MATTERMOST_TOKEN = '<MATTERMOST_SLASH_TOKEN>';
const SECRET_OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    let err = new Error(res.statusText);
    err.response = res;
    throw err;
  }
}

app.get('/weather', (req, res) => {
  fetch(`http://api.openweathermap.org/data/2.5/weather?zip=45420&APPID=${SECRET_OPENWEATHERMAP_API_KEY}&units=imperial`)
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
        "response_type": "in_channel",
        "text": retString
      });
    })
    .catch(error => {
        console.log(error);
        res.set('Content-Type', 'applicationn/json');
        res.send({
          "text": `Error fetching data!\n${error}`
        });
    });
});

app.listen(port, () => console.log(`MM-Slash app is listening on port ${port}`));
