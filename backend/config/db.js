const mongoose = require('mongoose');

// we can make this connectDB an IIFE (for now , we are importing this in the server.js file , and then running it there. This approach is better)

// whenever u want to make an IIFE , make sure to start it with ";". This is because we might have forgotten to put ";" b4 hand , and that could create problem for our IIFE

// this code could be written as in IIFE as follows :-
/* ;(async () => {
        try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
    })()

*/
const connectDB = async() => {
    // whenever u try to communicate with the backend , use try catch
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // this isnt needed anymore
            // useNewUrlParser: true, 
            // useUnifiedTopology: true 
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB