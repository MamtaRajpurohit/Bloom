import { db, auth } from "../firebase";
import { 
  collection, query, where, onSnapshot, updateDoc, addDoc, setDoc, getDoc, doc, arrayUnion, serverTimestamp 
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

/**
 * Start an anonymous session for users not logged in
 */
export const startAnonymousSession = async () => {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
      console.log("Anonymous user session started.");
    }
  } catch (error) {
    console.error("Error starting anonymous session:", error);
  }
};

/**
 * Listen for Firebase Auth changes
 */
export const listenForAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

/**
 * Set user status and mood in Firestore
 */
export const setUserStatus = async (userId, mood) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { status: "online", mood: mood || null }, { merge: true });
  } catch (error) {
    console.error("Error setting user status:", error);
  }
};

/**
 * Find a random available user with the same mood
 */
export const findStrangerWithMood = async (userId, mood) => {
  const q = query(
    collection(db, "users"),
    where("status", "==", "online"),
    where("mood", "==", mood),
    where("userId", "!=", userId) // Exclude the current user
  );

  return new Promise((resolve) => {
    onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      resolve(users.length > 0 ? users[0] : null);
    });
  });
};

/**
 * Create a new chat between two users
 */
export const createChatSession = async (user1Id, user2Id) => {
  try {
    const chatRef = await addDoc(collection(db, "chats"), {
      participants: [user1Id, user2Id],
      messages: [],
    });

    return chatRef.id;
  } catch (error) {
    console.error("Error creating chat session:", error);
  }
};

/**
 * Send a friend request by updating Firestore
 */
export const sendFriendRequest = async (fromUserId, toUserId) => {
  try {
    const userRef = doc(db, "users", toUserId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const existingRequests = userSnapshot.data().friendRequests || [];
      await updateDoc(userRef, {
        friendRequests: [...existingRequests, fromUserId],
      });
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};

/**
 * Save a chat message
 */
export const saveChatMessage = async (chatId, senderId, message) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      messages: arrayUnion({
        senderId,
        message,
        timestamp: serverTimestamp(),
      }),
    });
  } catch (error) {
    console.error("Error saving chat message:", error);
  }
};
