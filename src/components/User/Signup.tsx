import React, { useState } from "react";
import { ISignupRequest, ISignupResponse } from "../../type";
import axiosInstance from "../../Axios";
import toast from "react-hot-toast";

const Signup = () => {
    const [userName, setUsername] = useState<string>("");
    const [userEmail, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()

        const signupData: ISignupRequest = { userName, userEmail, password }
        try {
            const response = await axiosInstance.post<ISignupResponse>('/user/signup', signupData)
            const { message } = response.data
            if (response.status === 201) {
                // const { userEmail, userName, password } = response.data
                toast.success(message)
            } else {
                toast.error(message)
            }
        } catch (error: any) {
            toast.error(error)
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
            </form>
        </div>
    );
};

export default Signup;
