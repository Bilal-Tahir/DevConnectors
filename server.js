const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('API Running')); // To test the endpoint

const PORT = process.env.PORT || 5000; // If no environment variable set it will serve the application on 5000 (locally)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); //Second arg is callback function
