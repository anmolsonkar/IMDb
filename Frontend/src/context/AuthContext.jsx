import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

const authReducer = (state, action) => {
    switch (action.type) {
        case "SET_AUTH":
            return {
                ...state,
                authUser: action.payload.authUser,
                user: action.payload.user
            };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [cookies, removeCookie] = useCookies(["jwt"]);

    const logout = () => {
        removeCookie("jwt", { path: '/' });
        navigate("/login");
    };

    const [state, dispatch] = useReducer(authReducer, {
        authUser: null,
        user: null
    });

    const { authUser, user } = state;

    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                if (cookies.jwt) {
                    const { data } = await axios.post(
                        "http://localhost:4000",
                        {},
                        { withCredentials: true }
                    );
                    if (data.status) {
                        dispatch({
                            type: "SET_AUTH",
                            payload: {
                                authUser: cookies.jwt,
                                user: data.user
                            }
                        });
                    } else {
                        removeCookie("jwt");
                    }
                } else {
                    dispatch({
                        type: "SET_AUTH",
                        payload: {
                            authUser: null,
                            user: null
                        }
                    });
                }
            } catch (error) {
                console.error("Error verifying user:", error);
                removeCookie("jwt");
            }
        };

        verifyUser();
    }, [cookies.jwt, removeCookie, navigate]);

    return (
        <AuthContext.Provider value={{ authUser, user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};