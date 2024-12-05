import express, { Request, Response } from "express";
import { router } from "./routes/main";
import { connectDB } from "./db";
import Cors from "cors"


connectDB();
const app = express();
app.use(express.json());
app.use(Cors())



app.use("/",router);

app.listen(4000, () => console.log("server is up and running on port 4000"));
