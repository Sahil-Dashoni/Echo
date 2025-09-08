import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { setOtherUsers } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

const useOtherUser = () => {
  let dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/others`, { withCredentials: true });
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.error("Error fetching other users:", error);
      }
    };

    fetchUser();
  }, [dispatch, userData]);
};

export default useOtherUser;