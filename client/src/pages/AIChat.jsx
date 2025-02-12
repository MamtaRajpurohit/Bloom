import React, { useState } from "react";
import axios from "axios";
import "./Chat.css"; // Ensure this file exists for styling

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "You", text: input };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.post("http://localhost:5000/chat", { message: input });
            const botMessage = { sender: "AI", text: response.data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("❌ API Error:", error);
            setMessages((prev) => [...prev, { sender: "AI", text: "⚠️ Error: AI service unavailable" }]);
        }

        setInput("");
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === "You" ? "user" : "ai"}`}>
                        <b>{msg.sender}: </b> {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
