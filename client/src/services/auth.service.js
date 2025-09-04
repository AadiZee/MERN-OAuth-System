import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getUser = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("I AM RES => ", res);
    return res;
  } catch (error) {
    console.log("Error fetching user => ", error);
  }
};

export const login = async (loginType, formData) => {
  try {
    const endpoint =
      loginType === "email" ? "/auth/login/email" : "/auth/login/mobile";
    const data =
      loginType === "email"
        ? { email: formData.email, password: formData.password }
        : { mobile: formData.mobile, password: formData.password };
    const res = await axios.post(`${API_URL}${endpoint}`, data);
    return res;
  } catch (error) {
    console.log("Error logging in user => ", error);
  }
};

export const signup = async (signupType, formData) => {
  try {
    const endpoint =
      signupType === "email" ? "/auth/signup/email" : "/auth/signup/mobile";
    const data =
      signupType === "email"
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            mobile: formData.mobile,
            password: formData.password,
          };

    const res = await axios.post(`${API_URL}${endpoint}`, data);
    return res;
  } catch (error) {
    console.log("Error logging in user => ", error);
  }
};
