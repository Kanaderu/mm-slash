interface IConstants {
  OPENWEATHERMAP_API_KEY: string;
  PORT: number;
  POST_WEATHER_TOKEN: string;
}

const Settings: IConstants = {
  OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY as string,
  PORT: parseInt(process.env.PORT as string, 10),
  POST_WEATHER_TOKEN: process.env.POST_WEATHER_TOKEN as string,
};

export default Settings;
