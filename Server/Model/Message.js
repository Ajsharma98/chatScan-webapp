import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./User.js";
import Room from "./Room.js";
const Message = sequelize.define(
  "Message",
  {
    // Email column as primary key

    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Room,
        key: "room_id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    // Model options

    timestamps: false, // Disable automatic creation of createdAt and updatedAt
    tableName: "messages", // Specify the table name explicitly
  }
);

// Export the model
export default Message;
