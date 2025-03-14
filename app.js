const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const docs = require("./docs");
const hadithSearchRouter = require("./routes/hadithSearch.routes");

const config = require("./config/config");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json({ limit: config.expressJsonLimit }));

// Rate Limiting
app.use(
  rateLimit({
    windowMs: config.rateLimitEach,
    max: config.rateLimitMax,
    message: "Rate limit exceeded. Please try again later.",
    handler: (req, res, next, option) => {
      next(new AppError(option.message, 429));
    },
  }),
);

// to delete elements from hadith text or not
// including this `<span class="search-keys">...</span>`
app.use((req, res, next) => {
  req.isRemoveHTML = req.query.removehtml || true;
  req.isRemoveHTML = req.query.removehtml?.toLowerCase() === "false"
    ? false
    : true;
  next();
});

// set default page
app.use((req, res, next) => {
  req.query.page ||= 1;
  req.query.page = +req.query.page;
  next();
});

app.get("/", (req, res, next) => {
  res.status(302).redirect("/docs");
});
app.get("/docs", docs);

app.use("/v1", hadithSearchRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

app.use(errorHandler);

module.exports = app;
