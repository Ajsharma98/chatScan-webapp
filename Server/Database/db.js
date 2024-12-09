import { Sequelize } from "sequelize";
const sequelize = new Sequelize("ChatScan", "postgres", "anuj1234", {
  host: "localhost",
  dialect: "postgres",
});
async function testconnection() {
  // running the connection for checking
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
testconnection();
export default sequelize;
