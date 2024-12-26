import{writable,get} from "svelte/store";
export const room_id=writable('');
export const roomName=writable('');
export const chatHistory=writable([]);