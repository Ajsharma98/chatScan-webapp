import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./User.js";
const Room = sequelize.define(
  "Room",
  {
    // Email column as primary key
    room_name: {
      type: DataTypes.STRING, // Email is stored as a string
      allowNull: false,
      unique: true,
      // Email cannot be null
    },
    // Password column
    room_type: {
      type: DataTypes.STRING, // Password is stored as a string (hashed)
      allowNull: false,
      defaultValue: "public",
      validate: {
        isIn: [["public", "private"]], // Accept only these values
      }, // Password cannot be null
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    room_blocked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    invite_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latest_message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM("Clean", "Noisy", "Dirty"),
      allowNull: false,
      defaultValue: "Clean",
    },
  },
  {
    // Model options

    timestamps: true, // Disable automatic creation of createdAt and updatedAt
    tableName: "rooms", // Specify the table name explicitly
  }
);

// Export the model
export default Room;
