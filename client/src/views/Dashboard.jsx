import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import RemoveActivity from "../components/RemoveActivity";
import Logout from "../components/Logout";

export const Dashboard = () => {
  const [allUsersWithActivities, setAllUsersWithActivities] = useState([]);
  const token = localStorage.getItem("authToken");
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // users without activities won't show up, so make sure that all users have at least one activity
  // we can change this if you want and add a conditional rendering so it shows "No activities yet" for users without activities
  useEffect(() => {
    axios
      .get("http://localhost:8000/users/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAllUsersWithActivities(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const RemoveFromDom = (activityId) => {
    const updatedUsersWithActivities = allUsersWithActivities.map((user) => ({
      ...user,
      activities: user.activities.filter(
        (activity) => activity._id !== activityId
      ),
    }));
    setAllUsersWithActivities(updatedUsersWithActivities);
  };

  if (!token) {
    return (
      <h1 className="text-center pt-5 display-0">
        Please login to view this page.
      </h1>
    ); // or Nav
  }

  return (
    <div
      className="p-5 text-center"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="mt-5" style={{ height: "100%", width: "70%" }}>
      <div className="d-flex flex-col gap-3" style={{position:"absolute", top:"2%", right:"2%"}}><Link className="btn btn-info mt-5" to={`/home`}>Back to profile</Link><Logout /></div>
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
            {allUsersWithActivities && allUsersWithActivities.length > 0 ? allUsersWithActivities.flatMap((user) =>
              user.activities.map((activity) => (
                <tr key={activity._id}>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>
                    {activity.ActivityChecked} with {activity.CaloriesBurned.toFixed(3)}{" "}
                    Kcal burned
                  </td>
                  <td>
                    {loggedInUser._id === user._id ? (
                      <>
                        <Link
                          to={`/activity/edit/${activity._id}`}
                          className="mx-3"
                        >
                          <Button variant="success">Edit</Button>
                        </Link>
                        <RemoveActivity
                          activityId={activity._id}
                          cb={() => RemoveFromDom(activity._id)}
                        />
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/user/${user._id}`}
                          className="btn btn-primary"
                        >
                          Show
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (<p className="col-4 lead">No users activities yet</p>)}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
