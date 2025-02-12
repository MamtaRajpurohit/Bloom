import { io } from "socket.io-client";

const API_URL = "http:// 192.168.29.112:5000";


export const socket = io(API_URL, {
  reconnection: true,
  reconnectionAttempts: 10, // Try 10 times
  reconnectionDelay: 2000,  // 2-second delay
  timeout: 20000,           // 20-second connection timeout
});


// Ensure it doesn't connect multiple times
if (!socket.connected) {
  socket.connect();
}



export const findStranger = () => {
  socket.emit("find_stranger");
  console.log("Finding a stranger...");
};

export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const onMatchFound = (callback) => {
  socket.on("matched", (data) => {
    console.log("Matched with stranger:", JSON.stringify(data, null, 2));
    if (callback) callback(data);
  });

  socket.on("no_stranger_found", () => {
    console.log("No stranger found");
  });
};

export const sendMessageSocket = (message) => {
  socket.emit("message", message);
};

export const listenForMessages = (callback) => {
  socket.off("message");
  socket.on("message", (message) => {
    console.log("Message received:", message);
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

export const sendFriendRequest = (strangerId) => {
  socket.emit("send_friend_request", strangerId);
  console.log("Friend request sent!");
};

socket.on("friend_request_received", (strangerId) => {
  if (window.confirm(`Friend request received from ${strangerId}. Accept?`)) {
    socket.emit("accept_friend_request", strangerId);
  }
});

socket.on("friend_request_accepted", (friendId) => {
  alert(`Friend request accepted by ${friendId}!`);
});

socket.on("friend_list", (friends) => {
  console.log("Your friends:", friends);
});

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






