import React from 'react'
import axios from 'axios'

function RemoveActivity(props) {
    const {activityId, cb} = props
    const token = localStorage.getItem('authToken')

    const deleteActivity = () => {
        axios.delete(`http://localhost:8000/activity/${activityId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        .then(res => {
            console.log(res)
            cb()
            
        }).catch(err => console.log(err))
    };

  return (
    <>
    <button className='btn btn-danger' onClick={deleteActivity}>Delete</button>
    </>
  )
}

export default RemoveActivity
