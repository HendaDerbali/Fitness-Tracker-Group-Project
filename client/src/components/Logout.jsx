import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const Nav = useNavigate();
  const logmeout = () => {
    axios
      .post("http://localhost:8000/user/logout")
      .then((res) => {
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("user");
        console.log(res);
        Nav("/login");
      })
      .catch((err) => console.log(err));
  };

  if (!window.localStorage.getItem("authToken")) {
    Nav("/login");
  }

  return (
    <div className='position-absolute top-0 end-0 me-5'>
      <button
        className="btn btn-secondary ms-5 mt-5"
        onClick={() => logmeout()}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
