import { DataTypes } from "sequelize";
import sequelize from "../Database/db";
const File = sequelize.define(
  "File",
  {
    // Email column as primary key

    file_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file: {
      type: DataTypes.TEXT,
    },
  },
  {
    // Model options

    timestamps: false, // Disable automatic creation of createdAt and updatedAt
    tableName: "files", // Specify the table name explicitly
  }
);

// Export the model
export default File;
