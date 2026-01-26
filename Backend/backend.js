import { connectDB } from "./config/db.js";
import app from "./app.js";

/* <------ Database Connection ------> */

connectDB();

/* <------START SERVER------> */

const PORT = process.env.PORT || 4000   

const server = app.listen(PORT, () => {
    console.log(`Server is working on PORT ${PORT}`);
});



/* <---- ERROR HANDLING -----> */

process.on("unhandledRejection",(err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
})
process.on("uncaughtException",(err) => {
    console.error(`uncaughtException: ${err.message}`);
    process.exit(1);
})

export default server;