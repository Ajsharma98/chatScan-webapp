import { jwtDecode } from "jwt-decode";
export const getIdFromToken = async () => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Decode the token
      console.log("Decoded token:", decodedToken); // Log entire token payload

      // Extract the role from the decoded token
      // @ts-ignore
      const user_id = decodedToken.id;
      // @ts-ignore
      console.log("User_id:", user_id); // Log role
      return { user_id};
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
};
