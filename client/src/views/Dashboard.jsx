import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

export const Dashboard = () => {
    const [allUsersWithActivities, setAllUsersWithActivities] = useState([]);
    const token = localStorage.getItem('authToken');

    // users without activities won't show up, so make sure that all users have at least one activity
    // we can change this if you want and add a conditional rendering so it shows "No activities yet" for users without activities
    useEffect(() => {
        axios.get("http://localhost:8000/users/activities",{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(res => {
                console.log(res.data);
                setAllUsersWithActivities(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [token]);

    return (
        <div className='p-5 text-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ height: '100vh', width: "70%" }}>
                <h1>Check other user's streaks!</h1>
                <br />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Activities</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsersWithActivities.map((oneUser, index) => (
                            <tr key={oneUser._id || index}>
                                <td>{oneUser.firstName} {oneUser.lastName}</td>
                                <td>
                                    <ul>
                                        {oneUser.activities.map((activity, activityIndex) => (
                                            <li key={activityIndex}>{activity.ActivityChecked}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <Link to={`/edit/${oneUser._id}/edit`}><Button variant="secondary">Edit</Button></Link>
                                    <Button variant="danger" className="mx-3">Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default Dashboard;
