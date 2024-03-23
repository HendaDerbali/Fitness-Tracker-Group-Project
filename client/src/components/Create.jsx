import React from 'react'
import Logout from '../components/Logout';
import { useState, useEffect } from 'react';
import Model from 'react-modal'
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Create = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [profilePic, setProfilePic] = useState(null);
    // const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken')
    const [visible, setVisible] = useState(false)
    const [pictureErrors, setpictureErrors] = useState({})
    const [formErrors, setformErrors] = useState({})


    const [currentUser, setCurrentUser] = useState({})
    const reload = () => window.location.reload();


    const uploadProfilePic = (e) => {
        e.preventDefault()

        const profileData = new FormData();
        profileData.append("file", profilePic);

        axios.patch(`http://localhost:8000/user/profile/${user._id}/image`, profileData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            console.log(res.data.updatedUser.profilePic)
            setProfilePic(res.data.updatedUser.profilePic)
            reload()
        }).catch((err) => {
            console.log(err)
            setpictureErrors(err.response.data)
        })
    }


    const [activityForm, setActivityForm] = useState({
        Duration: '',
        Intensity: '',
        Distance: '',
        CaloriesBurned: '',
        ActivityChecked: ''

    });

    useEffect(() => {
        if (user && token) {
            axios
                .get(`http://localhost:8000/user/${user._id}`, {
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
    }, [loading]); //adding the user & token dependencies creates an infinite loop for some reason, will fix later




    //Create Activity : 





    const handleCreateActivity = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/activity', {
                Duration: activityForm.Duration,
                Distance: activityForm.Distance,
                Intensity: activityForm.Intensity,
                CaloriesBurned: activityForm.CaloriesBurned,
                ActivityChecked: activityForm.ActivityChecked
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(response);
            setActivityForm({
                Duration: '',
                Distance: '',
                Intensity: '',
                CaloriesBurned: '',
                ActivityChecked: ''
            });
        } catch (error) {
            console.log(error.response.data.errors);
            setformErrors(error.response.data.errors);
            //console.error('Error creating Activity:', error.message);
        }
    }

    if (!token) {
        return <h1 className='text-center pt-5 display-0'>Please login to view this page.</h1>; // or Nav
    }

    if (loading && token) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className='p-5'>
            <Logout />
            <div className='container-fluid d-flex justify-content-between border border-black bg-white shadow' style={{ height: '100vh', width: "70%" }}>
                <div className='d-flex flex-column mt-5 text-center align-content-center' style={{ width: '50%' }}>
                    <span className='ms-5 border rounded-circle border-black shadow' style={{ height: "28vh", width: "15vw" }}>{profilePic ? (<img className='d-flex justify-content-center border rounded-circle' alt='' src={`http://localhost:8000/public/images/${profilePic}`} style={{ height: "100%", width: "100%", object: "fill" }} />) : (<img className='d-flex justify-content-center border rounded-circle' alt='' src={`http://localhost:8000/public/images/circled-user-icon-user-pro-icon-11553397069rpnu1bqqup.png`} style={{ height: "100%", width: "100%", object: "fill" }} />)}
                        <button className='border-0 shadow fw-bold rounded-circle border-black text-center text-white bg-transparent' style={{ position: "relative", top: "-13%", height: "50px", width: "50px" }} onClick={() => setVisible(true)} name='profilePic'>+</button>
                        <Model
                            ariaHideApp={false}
                            isOpen={visible}
                            onRequestClose={() => setVisible(false)}
                            style={{
                                overlay: {
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    backdropFilter: "blur(2px)",
                                    WebkitBackdropfilter: "blur(2px)",
                                },
                                content: {
                                    border: "2px solid #ccc",
                                    top: "50%",
                                    left: "50%",
                                    right: "auto",
                                    bottom: "auto",
                                    marginRight: "-50%",
                                    transform: "translate(-50%, -50%)",
                                    borderRadius: "16px",
                                }
                            }}>
                            <button
                                className="pb-1 text-sm fw-semibold border border-2 rounded bg-danger px-2 text-white me-3 position-absolute end-0" onClick={() => setVisible(false)}>
                                x
                            </button>
                            <label className="fw-bold text-secondary">Upload profile picture </label>
                            <div className="display:flex justify-center flex-col my-2">
                                <form onSubmit={uploadProfilePic} enctype="multipart/form-data">
                                    <input
                                        className="py-2 px-4 border-0 text-sm fw-semibold"
                                        type='file'
                                        name='profilePic'
                                        onChange={(e) => setProfilePic(e.target.files[0])} />
                                    {pictureErrors.error && <p className="px-4 text-danger position-absolute">{pictureErrors.error}</p>}
                                    <button className="btn btn-success shadow-sm text-white text-sm fw-bold py-2 px-4 rounded-full d-flex" style={{ marginLeft: "auto" }}>
                                        Done
                                    </button>
                                </form>
                            </div>
                        </Model>
                    </span>
                    <p className='mt-5 pb-1 display-6 fw-semibold border-bottom'>{currentUser.firstName} {currentUser.lastName}</p>
                    <p className='fw-semibold'>"This is my bio"</p>
                    <div>
                        <Link to="/new-activities">Add a Goal</Link> <br />
                        <Link to="/users">All Users</Link>
                    </div>
                </div>
                {/* Check-Box Form... */}



                {/* Create Form... */}
                <div className='d-flex flex-row justify-content-between' style={{ width: '38%', position: "absolute", right: "400px", top: "15%" }}>
                    <p className='fw-semibold'>Track an Activity:</p>
                    <div className='d-flex flex-column mt-5' style={{ width: '15%' }}>
                        <form onSubmit={handleCreateActivity}>
                            {/* Radio buttons */}
                            {/* Input fields with values from activityForm */}
                            <div className='d-flex flew-row justify-content-between'>
                                <input type='radio' onChange={(e) =>
                                    setActivityForm({ ...activityForm, ActivityChecked: e.target.value })
                                } value="walking" id="walking" name="activityChecked" />
                                <label>Walking</label>

                            </div>
                            <div className='d-flex flew-row justify-content-between'>
                                <input type='radio' onChange={(e) =>
                                    setActivityForm({ ...activityForm, ActivityChecked: e.target.value })
                                } value="running" id="running" name="activityChecked" />
                                <label>Running</label>
                            </div>
                            <div className='d-flex flew-row justify-content-between'>
                                <input type='radio' onChange={(e) =>
                                    setActivityForm({ ...activityForm, ActivityChecked: e.target.value })
                                } value="cycling" id="cycling" name="activityChecked" />
                                <label>Cycling</label>
                            </div>
                            <div className='d-flex flew-row justify-content-between'>
                                <input type='radio' onChange={(e) =>
                                    setActivityForm({ ...activityForm, ActivityChecked: e.target.value })
                                } value="swimming" id="swimming" name="activityChecked" />
                                <label>Swimming</label>
                            </div>

                            <label>
                                Duration:
                                <input
                                    type="text"
                                    name="Duration"
                                    value={activityForm.Duration}
                                    onChange={(e) => setActivityForm({ ...activityForm, Duration: e.target.value })}

                                />
                                {formErrors.Duration && <p className="py-4 text-danger">{formErrors.Duration.message}</p>}

                            </label>
                            <br />
                            <label>
                                Distance:
                                <input
                                    type="text"
                                    name="Distance"
                                    value={activityForm.Distance}
                                    onChange={(e) => setActivityForm({ ...activityForm, Distance: e.target.value })}

                                />
                                {formErrors.Distance && <p className="py-4 text-danger">{formErrors.Distance.message}</p>}

                            </label>
                            <br />
                            <label>
                                Intensity:
                                <input
                                    type="text"
                                    name="Intensity"
                                    value={activityForm.Intensity}
                                    onChange={(e) => setActivityForm({ ...activityForm, Intensity: e.target.value })}

                                />
                                {formErrors.Intensity && <p className="py-4 text-danger">{formErrors.Intensity.message}</p>}

                            </label>
                            <br />
                            <label>
                                Calories Burned:
                                <input
                                    type="text"
                                    name="CaloriesBurned"
                                    value={activityForm.CaloriesBurned}
                                    onChange={(e) => setActivityForm({ ...activityForm, CaloriesBurned: e.target.value })}

                                />
                                {formErrors.CaloriesBurned && <p className="py-4 text-danger ">{formErrors.CaloriesBurned.message}</p>}

                            </label>
                            <button type="submit">Add Activity</button>
                        </form>
                    </div>
                </div>
                <Link to="/home">back to home page</Link> <br />

            </div>

        </div>



    )
}


