import React, { useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Handle email/password login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Logged in successfully!");
        } catch (error) {
            alert(error.message);
        }
    };

    // Handle Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            alert("Logged in with Google!");
        } catch (error) {
            alert(error.message);
        }
    };

    // Handle Logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Logged out successfully!");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Login;