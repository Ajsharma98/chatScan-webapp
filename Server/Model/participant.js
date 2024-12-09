import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import Room from "./Room.js";
import User from "./User.js";
const Participant = sequelize.define(
  "Participant",
  {
    // Email column as primary key

    participant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Room,
        key: "room_id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
  },
  {
    // Model options

    timestamps: false, // Disable automatic creation of createdAt and updatedAt
    tableName: "participants", // Specify the table name explicitly
  }
);

// Export the model
export default Participant;
