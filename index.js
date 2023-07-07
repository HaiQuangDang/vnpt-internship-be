const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;


// middleware
app.use(express.json());
app.use(cors()); 


//routes
app.use("/auth", require("./routes/jwtAuth"));

app.use("/dashboard", require("./routes/dashboard"));

app.use("/admin", require("./routes/admin"));

app.listen(port, () => {
    console.log(`Hi, I'm in the port ${port} !`);
})