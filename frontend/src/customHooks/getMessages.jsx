import { use, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { setOtherUsers } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { setMessages } from "../redux/messageSlice";
import { useRef } from "react";

const useMessages = () => {
  let dispatch = useDispatch();
    const { userData, selectedUserSlice } = useSelector(state => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
    if (!selectedUserSlice?._id) return; // 🚀 Don't run until user is selected

    try {
      const result = await axios.get(
        `${serverUrl}/api/message/get/${selectedUserSlice._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(result.data));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

    fetchMessages();
  }, [dispatch, selectedUserSlice, userData]);
};

export default useMessages;