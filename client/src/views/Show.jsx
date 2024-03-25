import React from 'react'
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Logout from '../components/Logout';
import axios from 'axios';

function Show() {
    const user = JSON.parse(localStorage.getItem('user'))
    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken')
    const [visible, setVisible] = useState(false)
    const [errors, setErrors] = useState({})
    const [currentUser, setCurrentUser] = useState({})
    const [isHovered, setIsHovered] = useState(false);
    const reload = () => window.location.reload();
    const { userId } = useParams()
          
          useEffect (() => {
            if (user && token) {
              axios
                .get(`http://localhost:8000/user/${userId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((res) => {
                  setProfilePic(res.data.user.profilePic);
                  setCurrentUser(res.data.user);
                  console.log(res.data.user);
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);
                });
            }
          },[loading]);


  return (
    <div>
      <div className='container-fluid d-flex justify-content-between border border-black bg-white shadow' style={{ height: '100vh', width:"70%" }}>
        <div className='d-flex flex-column mt-5 text-center align-content-center ms-4' style={{ width: '50%' }}>
          <span className='ms-5 border rounded-circle border-black shadow' style={{height:"28vh", width:"15vw"}}>{ profilePic ? (<img className='d-flex justify-content-center border rounded-circle' alt='' src={`http://localhost:8000/public/images/${profilePic}`} style={{height:"100%", width:"100%", object:"fill"}} />) : (<img className='d-flex justify-content-center border rounded-circle' alt='' src={`http://localhost:8000/public/images/circled-user-icon-user-pro-icon-11553397069rpnu1bqqup.png`} style={{height:"100%", width:"100%", objectFit:"cover"}} />)}
            </span>
          <p className='mt-5 pb-1 display-6 fw-semibold border-bottom'>{currentUser.firstName} {currentUser.lastName}</p>
          <p className='fw-semibold'>"This is my bio"</p>
          <div className='mt-5'>
          <Link to="/users">All Users</Link>
          <Logout />
          </div>
        </div>
        <div className='border m-5 container border-black shadow'>
          <p className='display-6 border-bottom text-center fw-semibold mt-5 pb-5'>My Stats</p>
        </div>
      </div>
    </div>
  )
}

export default Show
