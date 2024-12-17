import Room from "../Model/Room.js";

// Controller to fetch all rooms from the Room table
export const getAllRooms = async (req, res) => {
  try {
    // Fetch all rooms from the database
    const rooms = await Room.findAll();

    // Check if rooms were fetched
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" }); // Handle empty result set
    }

    // Return a 200 status with the rooms in the response
    return res.status(200).json({
      message: "Rooms fetched successfully",
      rooms, // Return the rooms data as JSON
    });
  } catch (error) {
    // Log the error for internal tracking
    console.error("Error fetching rooms:", error);

    // Return a generic error message to the client
    return res.status(500).json({ message: "Internal server error" });
  }
};
