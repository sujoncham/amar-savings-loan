const express = require("express");

const cors = require("cors");
// const cookieParser = require("cookie-parser");
require("dotenv").config();

const routerPerson = require("./modules/person/personRoute");
const routerLoan = require("./modules/loan/loanRoute");
const routerExpense = require("./modules/expense/expenseRoute");
const routerBlog = require("./modules/blog/blogRoute");
const routerUser = require("./modules/user/userRoute");
const routerMessage = require("./modules/messages/messagesRoute");
const routerTesti = require("./modules/testimonial/testimonialRoute");
const routerDonated = require("./modules/others/othersRoute");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
// app.use(cookieParser());

// Routes
app.use("/api/persons", routerPerson);
app.use("/api/loans", routerLoan);
app.use("/api/expenses", routerExpense);
app.use("/api/blogs", routerBlog);
app.use("/api/users", routerUser);
app.use("/api/message", routerMessage);
app.use("/api/testimonials", routerTesti);
app.use("/api/donations", routerDonated);

// app.use((req, res, next) => {
//   res.status(400).send("Request url was not found");
//   // next(400).send("Request url was not found")
// });

// app.use((err, req, res, next) => {
//   if (res.headerSent) {
//     next("There was a problem");
//   } else {
//     if (err.message) {
//       res.send(err.message);
//     } else {
//       res.send("There is an error!!");
//     }
//   }
// });

module.exports = app;
