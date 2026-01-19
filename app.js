import express from "express";

const app = express();
const port = process.env.SERVER_PORT;


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});