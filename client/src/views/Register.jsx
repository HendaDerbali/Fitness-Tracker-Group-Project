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

    const validateRegisterForm = () => {
        const errors = {};

        // Validate first name
        if (formData.firstName.trim().length < 2) {
            errors.firstName = 'First name must be at least 2 characters';
        }

        // Validate last name
        if (formData.lastName.trim().length < 2) {
            errors.lastName = 'Last name must be at least 2 characters';
        }

        // Validate email
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Validate password
        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        // Validate password match for registration
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

        const handleRegisterSubmit = async (e) => {
            e.preventDefault();
    
            if (!validateRegisterForm()) {
                return;
            }
    
            try {
               // setFormData(response.data.user)
               formData
                const response = await axios.post('http://localhost:8000/api/register', formData);
                const token = response.data.token;
                const { firstName, lastName, _id } = response.data.user
    
                // Save the token in localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify({ firstName, lastName, _id }));
                navigate('/LoginAndRegistration')
    
            } catch (error) {
                console.error(error.response.data.message);
                // Handle error (show error message or redirect)
            }
        };
    
     };

    
export const Register = () => {
    return (
      <div>
        <h2>Register</h2>
            <form onSubmit={handleRegisterSubmit}>
                <div>
                    <label>
                        First Name:
                        <input type="text" name="firstName" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                    </label>
                    {formErrors.firstName && <p className="error">{formErrors.firstName}</p>}
                </div>
                <br />
                <div>
                    <label>
                        Last Name:
                        <input type="text" name="lastName" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
                    </label>
                    {formErrors.lastName && <p className="error">{formErrors.lastName}</p>}
                </div>
                <br />
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
                <div>
                    <label>
                        Confirm Password:
                        <input
                            type="password"
                            name="confirmPassword"
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </label>
                    {formErrors.confirmPassword && <p className="error">{formErrors.confirmPassword}</p>}
                </div>
                <br />
                <button type="submit">Register</button>
            </form>
          
    </div>
  )
}
