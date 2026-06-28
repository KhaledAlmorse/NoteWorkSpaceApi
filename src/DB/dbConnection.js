import mongoose from "mongoose";
import chalk from "chalk";

const DBConnection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log(
        chalk.blue(
          `DataBase Connection Successfully ${mongoose.connection.host}`,
        ),
      );
    })
    .catch((err) => {
      throw new Error(`DataBase Connection Failed :${err}`);
    });
};

export default DBConnection;
