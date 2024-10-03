
import { useEffect } from 'react'
import useUserStore from '../../store/useUserStore'
import { useNavigate } from 'react-router-dom'
import PollList from '../poll/PollList'
import usePollStore from '../../store/usePollStore'

const Home = () => {
    const userState = useUserStore(state => state)
    useEffect(() => {
        console.log("userState ==>", userState)
    }, [])

    const navigate = useNavigate()
    const handleCreatePoll = () => {
        if (userState.userId) {
            navigate('/createPoll')
        } else {
            navigate('/login')
        }
    }


    console.log(usePollStore(state => state.polls))
    return (
        <>

            <div className='poll-creation-section'>
                <h2 className='home-heading'>
                    Create Polls and Engage with Your Community
                </h2>
                <button className='create-poll-btn' onClick={handleCreatePoll}>Create New Poll</button>

                <PollList userId={userState.userId} username={userState.userName} />

            </div>
        </>
    )
}

export default Home