import Settings from "../constants";
import WeatherController from "../controller/WeatherController";

// initialize controllers
const Weather = new WeatherController(Settings.OPENWEATHERMAP_API_KEY,
                                      Settings.POST_WEATHER_TOKEN);

export { Weather };
