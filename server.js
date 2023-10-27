const express = require("express");
const body_parser = require("body-parser");
const rpc_methods = require("./routes/rpc");

const app = express();

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use("/rpc", rpc_methods);

const port = process.env.PORT || 4444;

server = app.listen(port, () => console.log(`Server running on port ${port}`));

