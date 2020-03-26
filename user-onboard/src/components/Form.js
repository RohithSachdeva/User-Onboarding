import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';

const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
    terms: yup.boolean().oneOf([true], "Read and agree to continue")
});

export default function Form(props) {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [post, setPost] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
            setButtonDisabled(!valid);
        });
    }, [formState]);

    const validateChange = event => {
        yup.reach(formSchema, event.target.name)
            .validate(event.target.value)
            .then(valid => {
                setErrors({
                    ...errors,
                    [event.target.name]: ""
                });
            })
            .catch(err => {
                setErrors({
                    ...errors,
                    [event.target.name]: err.errors[0]
                });
            })
    };

    const inputChange = e => {
        e.persist();
        const newFormData = {
            ...formState,
            [e.target.name]:
                e.target.type === "checkbox" ? e.target.checked : e.target.value
        };
        setFormState(newFormData);
    };
    const formSubmit = e => {
        e.preventDefault();

        axios
            .post("https://reqres.in/api/users", formState)
            .then(res => {
                setPost(res.data); // get just the form data from the REST api
                console.log("success", post);
                setFormState({
                    name: "",
                    email: "",
                    password: "",
                    terms: ""
                });
            })
            .catch(err => console.log(err.response));
    };

    return (
        <div>
            <form onSubmit={formSubmit}>
                <label htmlFor="name">
                    Name
                      <input id="name" type="text" name="name" value={formState.name} onChange={inputChange} />
                    {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
                </label>
                <label htmlFor="email">
                    Email
                      <input id="email" type="email" name="email" value={formState.email} onChange={inputChange} />
                    {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
                </label>
                <label htmlFor="password">
                    Password
                      <input id="password" type="password" name="password" value={formState.password} onChange={inputChange} />
                    {errors.name.length > 0 ? <p className="error">{errors.password}</p> : null}
                </label>
                <label htmlFor="terms">
                    Terms and Conditions
                      <input id="terms" type="checkbox" name="terms" checked={formState.terms} onChange={inputChange} />
                </label>
                
                <button disabled={buttonDisabled}>Submit</button>
            </form>
            <div>
                <h1>Member Database</h1>
                {
                    users.map(e => <div> {e.name} {e.email}</div>)
                }
                <pre>{JSON.stringify(post, null, 2)}</pre>
            </div>
        </div>

    );





}