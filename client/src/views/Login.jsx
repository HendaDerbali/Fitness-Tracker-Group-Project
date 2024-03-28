import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const validateLoginForm = () => {
        const errors = {};
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
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
            const response = await axios.post('http://localhost:8000/user/login', formData);
            const token = response.data.token;
            const { firstName, lastName, _id } = response.data.user

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify({ firstName, lastName, _id }));
            navigate('/home')

        } catch (error) {
            console.error(error.response.data.message);
            setFormErrors({ email: error.response.data.message });
            if (error.response && error.response.status === 400){
                setFormErrors({ password: 'Incorrect email or password' });
            }
        }

    };

    return (
        <div className='pt-5 container-sm' style={{width: '500px'}}>
            <form onSubmit={handleLoginSubmit} className='shadow form-control p-5 d-flex text-center justify-content-center align-items-center flex-column border border-1'>
                <div>
                <h2 className='display-4 fw-semibold pb-3'>Login</h2>
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
                <p>New here? <a href="/">Register</a></p>
                <button type="submit" className='btn btn-success w-100 fw-semibold'>Login</button>
            </form>
        </div>
    );
};

export default Login;