
import Navbar from './Navbar'
import { useEffect } from 'react'
import useUserStore from '../../store/useUserStore'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const userState = useUserStore(state => state)
    useEffect(() => {
        console.log("userState ==>", userState.userName)
    }, [])

    const navigate = useNavigate()
    const handleCreatePoll = () => {
        if (userState.userId) {
            navigate('/createPoll')
        } else {
            navigate('/login')
        }
    }

    return (
        <>
      
            <div className='poll-creation-section'>
                <h2 className='home-heading'>
                    Create Polls and Engage with Your Community
                </h2>
                <button className='create-poll-btn' onClick={handleCreatePoll}>Create New Poll</button>
            </div>
        </>
    )
}

export default Home