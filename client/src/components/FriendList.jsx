import { useEffect, useState } from "react";
import { socket } from "../utilis/api"; 
import { Box, Typography, List, ListItem, Button } from "@mui/material";



const FriendList = ({ onSelectFriend }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Trigger get_friend_list when this component loads
    socket.emit("get_friend_list");
    console.log("Requesting friend list...");

    // Listen for friend list updates
    socket.on("friend_list", (friendsList) => {
      setFriends(friendsList);
      console.log("Received friend list:", friendsList);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("friend_list");
    };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Your Friends
      </Typography>
      {friends.length === 0 ? (
        <Typography sx={{ color: "gray", mt: 2 }}>
          You haven't made any friends yet.
        </Typography>
      ) : (
        <List>
          {friends.map((friend) => (
            <ListItem key={friend} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>{friend}</Typography>
              <Button variant="outlined" onClick={() => onSelectFriend(friend)}>
                Chat
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FriendList;


