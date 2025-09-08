import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

const useCurrentUser = () => {
  let dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useCurrentUser;