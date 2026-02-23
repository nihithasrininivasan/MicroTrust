const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const scoreRoutes = require("./routes/score.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/score", scoreRoutes);

app.use(errorHandler);

module.exports = app;
