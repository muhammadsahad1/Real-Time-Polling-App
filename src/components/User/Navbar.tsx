import { IoLogOut } from "react-icons/io5";
import useUserStore from "../../store/useUserStore";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const clearUserState = useUserStore(state => state.clearUser);
    const navigate = useNavigate()

    const handleLogout = () => {
        clearUserState();
        navigate('/')
        toast.success('Successfully logged out!');
    }

    return (
        <nav className="navbar">
            <div className="navbar-content">Polling World</div>
            <div className="logout-div" onClick={handleLogout}>
                <IoLogOut />
            </div>
        </nav>
    );
}

export default Navbar;
