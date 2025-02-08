const API_URL = "http://localhost:5000"; // Replace with ngrok URL if hosted externally

// Fetch all messages
export const getMessages = async () => {
  try {
    const response = await fetch(`${API_URL}/api/messages`);
    if (!response.ok) throw new Error("Failed to fetch messages");
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

// Send a new message
export const sendMessage = async (newMessage) => {
  try {
    const response = await fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Signup new user
export const signup = async (userDetails) => {
  try {
    const response = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    });
    if (!response.ok) throw new Error("Signup failed");
    return await response.json();
  } catch (error) {
    console.error("Signup error:", error);
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error("Login failed");
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
  }
};


