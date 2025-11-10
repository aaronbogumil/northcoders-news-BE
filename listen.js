// const app = require("./app");

// app.listen(8000, () => {
//   console.log("listening on 8000");
// });

const app = require("./app.js");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
