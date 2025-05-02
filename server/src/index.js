import connectDb from "./db/db.js";
import "dotenv/config";
import { server } from "./utils/socket.js";

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Socket server is running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to MongoDB", error);
  });
