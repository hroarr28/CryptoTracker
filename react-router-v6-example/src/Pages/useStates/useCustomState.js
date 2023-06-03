import {useState} from "react";

export const useCustomState = () => {
  const [loggedin, setLoggedin] = useState(false);
  return [loggedin, setLoggedin];
};
