import { Request, Response } from "express";
import BaseController from "./BaseController";
import ExternalAPI from "./ExternalAPI";

import { IWeatherApi } from "../types/Api";

export default class WeatherContorller extends BaseController {

  private API_KEY: string;

  constructor(API_KEY: string, API_TOKEN: string) {
    super(API_TOKEN);
    this.API_KEY = API_KEY;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void | any> {
    try {
      this.verifyToken(req);

      // test query zipcode is valid using regex
      const zipcode = !req.body || !req.body.text || req.body.text.trim() === "" ? 45469 : req.body.text.trim();
      if (/^[0-9]{5}(?:-[0-9]{4})?$/.test(zipcode)) {
        this.fetchWeather<IWeatherApi>(parseInt(zipcode, 10))
        .then((data) => {
          const retString = `## Weather in ${data.name} is currently: ` +
                            data.weather.map((weatherData, key) => key > 1 ? " and " : "" + weatherData.description) + "\n" +
                            `### Wind speeds: ${data.wind.speed} mi/h at ${data.wind.deg} degrees ` +
                            `with ${data.clouds.all * 100}% clouds and ${data.main.humidity}% humidity\n\n` +
                            `|            | Temperature                |\n` +
                            `|:-----------|----------------------------|\n` +
                            `| Currently  | ${data.main.temp} °F       |\n` +
                            `| Feels Like | ${data.main.feels_like} °F |\n` +
                            `| High       | ${data.main.temp_max} °F   |\n` +
                            `| Low        | ${data.main.temp_min} °F   |\n`;

          return this.ok(res, {
            response_type: "ephemeral",
            text: retString,
          });
        });
      } else {
        throw new Error("Incorrect Zipcode Format Provided");
      }

    } catch (err) {
      return this.fail(res, err.toString());
    }
  }

  private fetchWeather<T>(zipcode: number) {
    const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&APPID=${this.API_KEY}&units=imperial`;
    return ExternalAPI<T>(url);
  }

}
