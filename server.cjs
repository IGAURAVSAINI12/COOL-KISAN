const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send('server is running!');

}
);

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`server running on port ${PORT}`);
}
);
