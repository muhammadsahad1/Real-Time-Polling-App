import React, { useState } from "react";
import { ISignupRequest, ISignupResponse } from "../../type";
import axiosInstance from "../../Axios";
import toast from "react-hot-toast";
import useUserStore, { SetUserActionType } from "../../store/useUserStore";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [userName, setUsername] = useState<string>("");
    const [userEmail, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate()
    const setUser = useUserStore((state) => state.setUser)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()

        const signupData: ISignupRequest = { userName, userEmail, password }
        try {
            const response = await axiosInstance.post<ISignupResponse>('/users/register', signupData)
            console.log("res in signup =>", response.data)
            const { message } = response.data
            if (response.status === 201) {
                toast.success("Register successfull")
                navigate('/login')

            } else {
                toast.error(message)
            }
        } catch (error: any) {
            toast.error(error.response.data.message || "An error occurred");
        }

    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2 className="signup-heading">Register</h2>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        id="username"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        id="email"
                        value={userEmail}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="sumbitDiv">
                    <button type="submit" className="signup-btn">
                        Register
                    </button>
                </div>
                <p className="login-link">
                    Don't have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
