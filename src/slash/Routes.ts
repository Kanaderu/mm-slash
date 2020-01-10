import { Router } from "express";
import { Weather } from "./index";

const SlashRouter: Router = Router();
SlashRouter.post("/weather", (req, res) => Weather.execute(req, res));

export default SlashRouter;
