//To connect to mongoose
const mongoose = require('mongoose');
const config = require('config');
//To get the value we created in config/default.json
const db = config.get('mongoURI');

//mongoose.connect(db) will give us back a promise, so we could use .then
//We'll be focusing on async await | standard way | code looks cleaner

//async arrow function
// try catch to catch the error
//mostly with async await we use try catch
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewURLParser: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.log(err.message);

    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
