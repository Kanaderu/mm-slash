import bodyParser from "body-parser";
import express from "express";
import Settings from "./constants";
import SlashRoutes from "./slash/Routes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup custom slash commands at /slash
app.use("/slash", SlashRoutes);
app.listen(Settings.PORT,
  () => console.log("Listening on Port " + Settings.PORT));
