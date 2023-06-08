const express = require('express');
const connectDB = require('./config/db');

const app = express();

// INIT Middleware (PARSER 1)

//If we are using express it is already available else we can import and use it as app.use(bodyParser.json());
// Get data in req.body
app.use(express.json({ extended: false }));

//To connect to database
connectDB();

app.get('/', (req, res) => res.send('API Running')); // To test the endpoint

//This will make the request go to routes/api/users where we have deined /
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000; // If no environment variable set it will serve the application on 5000 (locally)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); //Second arg is callback function
