import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Auth = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [formErrors, setFormErrors] = useState({});


    const validateLoginForm = () => {
        const errors = {};

        // Validate email
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Validate password
        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

   
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!validateLoginForm()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/login', formData);

            const token = response.data.token;
            const { firstName, lastName, _id } = response.data.user

            // Save the token in localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify({ firstName, lastName, _id }));
            navigate('/home')
            // Store the token in localStorage or a state management library
            // Redirect or show success message
        } catch (error) {
            console.error(error.response.data.message);
            // Handle error (show error message or redirect)
        }

    };

    return (
        <div>
            

            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
                <div>
                    <label>
                        Email:
                        <input type="email" name="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </label>
                    {formErrors.email && <p className="error">{formErrors.email}</p>}
                </div>
                <br />
                <div>
                    <label>
                        Password:
                        <input type="password" name="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </label>
                    {formErrors.password && <p className="error">{formErrors.password}</p>}
                </div>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Auth;