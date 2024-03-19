import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

 const Register = () => {
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

        if (formData.firstName.trim().length < 2) {
            errors.firstName = 'First name must be at least 2 characters';
        }

        if (formData.lastName.trim().length < 2) {
            errors.lastName = 'Last name must be at least 2 characters';
        }

        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

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
            const res = await axios.post('http://localhost:5000/user/register', formData);
            console.log(res.data)
            navigate('/login');

        } catch (error) {
            console.error(error.response.data.message);
            setFormErrors(error.response.data.message);
            if (error.response.data.message === 'Email already exists') {
                setFormErrors({ email: 'This email is already registered' });
            }
        }
    };
 
 return (
      <div className='pt-5 container-sm' style={{width: '500px'}}>
            <form onSubmit={handleRegisterSubmit} className='shadow form-control p-5 d-flex text-center justify-content-center align-items-center flex-column border border-1'>
            <h2 className='display-4 fw-semibold'>Register</h2>
                <div className='m-3'>
                    <label className='d-flex flex-column gap-2 fw-semibold form-label'>
                        First Name:
                        <input className='form-control' style={{width: '250px'}} type="text" name="firstName" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}/>
                    </label>
                    {formErrors.firstName && <p className="text-danger">{formErrors.firstName}</p>}
                </div>
                <br />
                <div>
                    <label className='d-flex flex-column gap-2 fw-semibold form-label'>
                        Last Name:
                        <input className='form-control' style={{width: '250px'}} type="text" name="lastName" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}/>
                    </label>
                    {formErrors.lastName && <p className="text-danger">{formErrors.lastName}</p>}
                </div>
                <br />
                <div>
                    <label className='d-flex flex-column gap-2 fw-semibold form-label'>
                        Email:
                        <input className='form-control' style={{width: '250px'}} type="email" name="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
                    </label>
                    {formErrors.email && <p className="text-danger">{formErrors.email}</p>}
                </div>
                <br />
                <div>
                    <label className='d-flex flex-column gap-2 fw-semibold form-label'>
                        Password:
                        <input className='form-control' style={{width: '250px'}} type="password" name="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
                    </label>
                    {formErrors.password && <p className="text-danger">{formErrors.password}</p>}
                </div>
                <br />
                <div>
                    <label className='d-flex flex-column gap-2 fw-semibold form-label'>
                        Confirm Password:
                        <input className='form-control' style={{width: '250px'}}
                            type="password"
                            name="confirmPassword"
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </label>
                    {formErrors.confirmPassword && <p className="text-danger">{formErrors.confirmPassword}</p>}
                </div>
                <br />
                <p>Have an account? <a href="/login">Login</a></p>
                <button type="submit" className='btn btn-primary w-100 fw-semibold'>Create</button>
            </form>
          
    </div>
  )
};

export default Register;
