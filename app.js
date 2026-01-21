import express from "express";
import cors from "cors";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import connection from "./database/dbConnections.js";
import moviesRouter from "./routers/moviesRouter.js";


const app = express();
const port = process.env.SERVER_PORT;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
};

app.use(cors(corsOptions));


app.use(express.static("public"));

app.use(express.json());


app.use("/api/movies", moviesRouter);


app.use(errorHandler);
app.use(notFound)

app.listen(port, function (error) {

  if (error) {
    console.log(error);
  }
  else {
    console.log("Server is connected on port " + port);
  }

});