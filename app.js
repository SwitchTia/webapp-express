import express from "express";
import cors from "cors";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";




const app = express();
const port = process.env.SERVER_PORT;

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));


app.use(express.static("public"));

app.use(express.json());



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