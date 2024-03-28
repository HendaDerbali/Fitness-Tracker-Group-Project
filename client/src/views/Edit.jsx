import React from "react";
import Logout from "../components/Logout";
import { useState, useEffect } from "react";
import Model from "react-modal";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

export const Edit = () => {
  // const [bio, setBio] = useState('');
  const user = JSON.parse(localStorage.getItem("user"));
  const [profilePic, setProfilePic] = useState(null);
  const reload = () => window.location.reload();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const [visible, setVisible] = useState(false);
  const [pictureErrors, setpictureErrors] = useState({});
  const [formErrors, setformErrors] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [activityForm, setActivityForm] = useState({
    Duration: 0,
    Intensity: "Minimal",
    Distance: 0,
    Weight: 0,
    Height: 0,
    Age: 0,
    Gender: "Male",
    ActivityChecked: "walking",
    Owner: user._id,
  });
  const { activityId } = useParams();
  const Nav = useNavigate();

  const uploadProfilePic = (e) => {
    e.preventDefault();

    const profileData = new FormData();
    profileData.append("file", profilePic);

    axios
      .patch(
        `http://localhost:8000/user/profile/${user._id}/image`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data.updatedUser.profilePic);
        setProfilePic(res.data.updatedUser.profilePic);
        reload();
      })
      .catch((err) => {
        console.log(err);
        setpictureErrors(err.response.data);
      });
  };

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

  useEffect(() => {
    if (user && token) {
      axios
        .get(`http://localhost:8000/activity/${activityId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("Activity data:", res.data);
          const activityData = res.data;
          setActivityForm({
            ...activityForm,
            Duration: activityData.Duration,
            Distance: activityData.Distance,
            Intensity: activityData.Intensity,
            Weight: activityData.Weight,
            Height: activityData.Height,
            Age: activityData.Age,
            Gender: activityData.Gender,
            ActivityChecked: activityData.ActivityChecked,
            Owner: currentUser._id,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [token]);

  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `http://localhost:8000/activity/${activityId}/update`,
        {
          Duration: activityForm.Duration,
          Distance: activityForm.Distance,
          Intensity: activityForm.Intensity,
          Weight: activityForm.Weight,
          Height: activityForm.Height,
          Age: activityForm.Age,
          Gender: activityForm.Gender,
          ActivityChecked: activityForm.ActivityChecked,
          Owner: currentUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActivityForm(res.data);
      setActivityForm({
        Duration: 0,
        Intensity: "Minimal",
        Distance: 0,
        Weight: 0,
        Height: 0,
        Age: 0,
        Gender: "Male",
        ActivityChecked: "walking",
        Owner: user._id,
      });
      Nav(`/users`);
      console.log(res);
    } catch (error) {
      console.log(error.response.data);
      setformErrors(error.response.data);
    }
  };

  if (!token) {
    return (
      <h1 className="text-center pt-5 display-0">
        Please login to view this page.
      </h1>
    ); // or Nav
  }

  if (loading && token) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div
        className="container-fluid d-flex justify-content-between border border-black bg-white shadow "
        style={{ height: "118vh", width: "70%" }}
      >
        <div
          className="d-flex flex-column mt-5 text-center align-content-center ms-4"
          style={{ width: "50%" }}
        >
          <span
            className="ms-5 border rounded-circle border-black shadow"
            style={{
              height: "28vh",
              width: "15vw",
              position: "relative",
              left: "0",
            }}
          >
            {profilePic ? (
              <img
                className="d-flex justify-content-center border rounded-circle"
                alt=""
                src={`http://localhost:8000/public/images/${profilePic}`}
                style={{ height: "100%", width: "100%", object: "fill" }}
              />
            ) : (
              <img
                className="d-flex justify-content-center border rounded-circle"
                alt=""
                src={`http://localhost:8000/public/images/circled-user-icon-user-pro-icon-11553397069rpnu1bqqup.png`}
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            )}
            <button
              className="border-0 shadow fw-bold rounded-circle border-black text-center text-white mask"
              style={{
                position: "relative",
                top: "-13%",
                height: "50px",
                width: "50px",
                background:
                  "linear-gradient(45deg, hsla(168, 85%, 52%, 0.5), hsla(263, 88%, 45%, 0.5))",
                transition: "background 0.3s ease, transform 0.3s ease",
                transform: isHovered ? "scale(1.1)" : "scale(1)",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setVisible(true)}
              name="profilePic"
            >
              +
            </button>
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
                },
              }}
            >
              <button
                className="pb-1 text-sm fw-semibold border border-2 rounded bg-danger px-2 text-white me-3 position-absolute end-0"
                onClick={() => setVisible(false)}
              >
                x
              </button>
              <label className="fw-bold text-secondary">
                Upload profile picture
              </label>
              <div className="display:flex justify-center flex-col my-2">
                <form onSubmit={uploadProfilePic} enctype="multipart/form-data">
                  <input
                    className="py-2 px-4 border-0 text-sm fw-semibold"
                    type="file"
                    name="profilePic"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                  />
                  {pictureErrors.error && (
                    <p className="px-4 text-danger position-absolute">
                      {pictureErrors.error}
                    </p>
                  )}
                  <button
                    className="btn btn-success shadow-sm text-white text-sm fw-bold py-2 px-4 rounded-full d-flex"
                    style={{ marginLeft: "auto" }}
                  >
                    Done
                  </button>
                </form>
              </div>
            </Model>
          </span>
          <p className="mt-5 pb-1 display-6 fw-semibold border-bottom">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="fw-semibold">"This is my bio"</p>
          <div className="d-flex flex-column mt-5">
            <Link to="/home">Back to home page</Link>
            <Link to="/users">All Users</Link>
            <Logout />
          </div>
        </div>

        <div
          className="d-flex flex-row justify-content-between container border border-black m-5 shadow"
          style={{ position: "relative", right: "0px", height: "110vh" }}
        >
          <p className="fw-semibold m-5">Edit an Activity:</p>
          <div className="d-flex flex-column m-5" style={{ width: "18%" }}>
            <form onSubmit={handleUpdateActivity}>
              <div className="bg-success d-flex flew-row justify-content-between gap-2 form-control px-2 mb-1">
                <input
                  type="radio"
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      ActivityChecked: e.target.value,
                    })
                  }
                  value="walking"
                  id="walking"
                  name="activityChecked"
                  defaultChecked
                />
                <label>Walking</label>
              </div>
              <div className="bg-danger d-flex flew-row justify-content-between gap-2 form-control px-2 mb-1">
                <input
                  type="radio"
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      ActivityChecked: e.target.value,
                    })
                  }
                  value="running"
                  id="running"
                  name="activityChecked"
                />
                <label>Running</label>
              </div>
              <div className="bg-warning d-flex flew-row justify-content-between gap-2 form-control px-2 mb-1">
                <input
                  type="radio"
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      ActivityChecked: e.target.value,
                    })
                  }
                  value="cycling"
                  id="cycling"
                  name="activityChecked"
                />
                <label>Cycling</label>
              </div>
              <div className="bg-info d-flex flew-row justify-content-between gap-2 form-control px-2 mb-1">
                <input
                  type="radio"
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      ActivityChecked: e.target.value,
                    })
                  }
                  value="swimming"
                  id="swimming"
                  name="activityChecked"
                />
                <label>Swimming</label>
              </div>

              <div
                className="container mt-5 border border-black shadow d-flex flex-column justify-content-center text-center m-5"
                style={{
                  position: "absolute",
                  right: "0px",
                  top: "16%",
                  height: "80vh",
                  width: "85%",
                }}
              >
                <label className="form-label d-flex flex-column mb-5 fw-semibold">
                  Duration: Min
                  <input
                    placeholder="Min"
                    type="number"
                    name="Duration"
                    value={activityForm.Duration}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        Duration: e.target.value,
                      })
                    }
                  />
                  {formErrors.errors &&
                    formErrors.errors.some(
                      (error) => error.field === "Duration"
                    ) && (
                      <p className="text-danger position-absolute mt-5 pt-2">
                        {
                          formErrors.errors.find(
                            (error) => error.field === "Duration"
                          ).message
                        }
                      </p>
                    )}
                </label>
                <label className="form-label d-flex flex-column mb-5 fw-semibold">
                  Distance: m
                  <input
                    placeholder="m"
                    type="number"
                    name="Distance"
                    value={activityForm.Distance}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        Distance: e.target.value,
                      })
                    }
                  />
                  {formErrors.errors &&
                    formErrors.errors.some(
                      (error) => error.field === "Distance"
                    ) && (
                      <p className="text-danger position-absolute mt-5 pt-2">
                        {
                          formErrors.errors.find(
                            (error) => error.field === "Distance"
                          ).message
                        }
                      </p>
                    )}
                </label>
                <label className="form-label d-flex flex-column mb-5 fw-semibold">
                  Intensity: Level
                  <select
                    name="Intensity"
                    id="Intensity"
                    value={activityForm.Intensity}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        Intensity: e.target.value,
                      })
                    }
                  >
                    <option value={"Minimal"}>Minimal</option>
                    <option value={"Moderate"}>Moderate</option>
                    <option value={"Hard"}>Hard</option>
                  </select>
                </label>
                <label className="form-label d-flex flex-column mb-5 fw-semibold">
                  Weight: Kg
                  <input
                    placeholder="Kg"
                    type="number"
                    name="Weight"
                    value={activityForm.Weight}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        Weight: e.target.value,
                      })
                    }
                  />
                  {formErrors.errors &&
                    formErrors.errors.some(
                      (error) => error.field === "Weight"
                    ) && (
                      <p className="text-danger position-absolute mt-5 pt-2">
                        {
                          formErrors.errors.find(
                            (error) => error.field === "Weight"
                          ).message
                        }
                      </p>
                    )}
                </label>
                <label className="form-label d-flex flex-column mb-5 fw-semibold">
                  Height: Cm
                  <input
                    placeholder="Cm"
                    type="number"
                    name="Height"
                    value={activityForm.Height}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        Height: e.target.value,
                      })
                    }
                  />
                  {formErrors.errors &&
                    formErrors.errors.some(
                      (error) => error.field === "Height"
                    ) && (
                      <p className="text-danger position-absolute mt-5 pt-2">
                        {
                          formErrors.errors.find(
                            (error) => error.field === "Height"
                          ).message
                        }
                      </p>
                    )}
                </label>
                <label className="form-label d-flex flex-column mb-5 fw-semibold">
                  Age:
                  <input
                    placeholder="Yrs"
                    type="number"
                    name="Age"
                    value={activityForm.Age}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        Age: e.target.value,
                      })
                    }
                  />
                  {formErrors.errors &&
                    formErrors.errors.some(
                      (error) => error.field === "Age"
                    ) && (
                      <p className="text-danger position-absolute mt-5 pt-2">
                        {
                          formErrors.errors.find(
                            (error) => error.field === "Age"
                          ).message
                        }
                      </p>
                    )}
                </label>
                <div className="d-flex gap-5 justify-content-center mb-3">
                  <label className="block mb-2 fw-medium">Gender:</label>
                  <div className="d-flex gap-5">
                    <input
                      defaultChecked
                      className="mb-2"
                      type="radio"
                      id="Male"
                      name="Gender"
                      value="Male"
                      onChange={(e) =>
                        setActivityForm({
                          ...activityForm,
                          Gender: e.target.value,
                        })
                      }
                    />
                    <label className="me-1 fw-medium text-secondary">
                      Male
                    </label>
                    <input
                      className="mb-2"
                      type="radio"
                      id="Female"
                      name="Gender"
                      value="Female"
                      onChange={(e) =>
                        setActivityForm({
                          ...activityForm,
                          Gender: e.target.value,
                        })
                      }
                    />
                    <label className="me-1 text-sm fw-medium text-secondary">
                      Female
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-warning fw-semibold mx-5"
                >
                  Edit Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
