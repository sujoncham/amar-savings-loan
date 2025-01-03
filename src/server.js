const app = require("./app");
const connectDB = require("./config/connectDB");
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`My port is http://localhost:${port}`);
  connectDB();
});
