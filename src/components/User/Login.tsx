import React, { useState } from "react"
import axiosInstance from "../../Axios"
import { ILoginRequest, ILoginResponse } from "../../type"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import useUserStore, { SetUserActionType } from "../../store/useUserStore"

const Login = () => {
    const [password, setPassoword] = useState<string>('')
    const [userEmail, setUserEmail] = useState<string>('')

    const navigate = useNavigate()
    const setUser = useUserStore((state) => state.setUser)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const loginData: ILoginRequest = { userEmail, password }
        try {
            const response = await axiosInstance.post<ILoginResponse>('/users/login', loginData)
            console.log("res in login =>", response.data)
            const { message } = response.data;
            if (response.status === 200) {
                const { _id, name, email } = response.data.findUser

                setUser({ type: SetUserActionType.UserId, value: _id })
                setUser({ type: SetUserActionType.Email, value: email })
                setUser({ type: SetUserActionType.Name, value: name })
                toast.success('Login successfull')
                navigate('/')
            } else {
                toast.error(message)
            }

        } catch (error: any) {
            toast.error(error)
        }

    }

    return (
        <div className="login-container">

            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-heading">Login</h2>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Enter you email" id="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Enter you password" id="password" value={password} onChange={(e) => setPassoword(e.target.value)} />
                </div>

                <button type="submit" className="login-btn"> Login In </button>

                <p className="signup-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    )
}

export default Login