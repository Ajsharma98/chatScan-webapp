import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
const User = sequelize.define(
  "User",
  {
    // Email column as primary key
    email: {
      type: DataTypes.STRING, // Email is stored as a string
      allowNull: false,
      // Email cannot be null
    },
    // Password column
    password: {
      type: DataTypes.STRING, // Password is stored as a string (hashed)
      allowNull: false, // Password cannot be null
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_blocked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    // Model options

    timestamps: true, // Disable automatic creation of createdAt and updatedAt
    tableName: "users", // Specify the table name explicitly
  }
);

// Export the model
export default User;
