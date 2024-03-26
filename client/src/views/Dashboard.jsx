import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import RemoveActivity from "../components/RemoveActivity";

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

  return (
    <div
      className="p-5 text-center"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ height: "100vh", width: "70%" }}>
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
            {allUsersWithActivities.flatMap((user) =>
              user.activities.map((activity) => (
                <tr key={activity._id}>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>
                    {activity.ActivityChecked} with {activity.CaloriesBurned}{" "}
                    Kcal burned
                  </td>
                  <td>
                    {loggedInUser._id === user._id ? (
                      <>
                        <Link
                          to={`/activity/edit/${activity._id}`}
                          className="mx-3"
                        >
                          <Button variant="secondary">Edit</Button>
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
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
