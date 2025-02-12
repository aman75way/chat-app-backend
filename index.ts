import bodyParser from "body-parser";
import routes from "./app/routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server } from "./app/common/services/socket.service";
import swaggerDocument from "./swagger.json";
import swaggerUi from "swagger-ui-express";

dotenv.config()

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", routes)

server.listen(PORT, () => { console.log(`Server PORT running on http://localhost:${PORT}`) }) 