import { io } from "socket.io-client";

const API_URL = "http://192.168.29.112:5000";

const socket = io(API_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Ensure it doesn't connect multiple times
if (!socket.connected) {
  socket.connect();
}

let matchCallback = null;

socket.emit("find_stranger");
console.log("Finding a stranger...");


socket.on("matched", (data) => {
  console.log("Matched with stranger:", JSON.stringify(data, null, 2));
  if (matchCallback) {
    matchCallback(data);
  }
});

socket.on("no_stranger_found", () => {
  console.log("No stranger found");
});

export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const onMatchFound = (callback) => {
  matchCallback = callback;
};

export const sendMessageSocket = (message) => {
  socket.emit("message", message);
};

export const listenForMessages = (callback) => {
  socket.on("message", (message) => {
    callback(message);
  });
};

export const getMessages = async () => {
  try {
    const response = await fetch(`${API_URL}/api/messages`);
    if (!response.ok) throw new Error("Failed to fetch messages");
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

export const sendMessage = async (newMessage) => {
  try {
    const response = await fetch(`${API_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const signup = async (userDetails) => {
  try {
    const response = await fetch(`${API_URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });
    if (!response.ok) throw new Error("Signup failed");
    return await response.json();
  } catch (error) {
    console.error("Signup error:", error);
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error("Login failed");
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
  }
};



