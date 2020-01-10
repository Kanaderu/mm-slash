import express from "express";
import Settings from "./constants";
import SlashRoutes from "./slash/Routes";

const app = express();

// setup custom slash commands at /slash
app.use("/slash", SlashRoutes);
app.listen(Settings.PORT,
  () => console.log("Listening on Port " + Settings.PORT));
