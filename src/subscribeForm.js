import React, { useState, useEffect } from "react";
import { auth, firebaseAuth } from "./firebase";

const initialValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
  otp: "",
};

// Initialize Firebase

const SubscribeForm = () => {
  const [values, setValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const { name, phone, email, address, otp } = values;

  const handleSubmit = () => {};

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={handleInputChange}
          name="name"
          type="text"
          label="name"
          placeholder="Name"
        />
        <input
          value={phone}
          onChange={handleInputChange}
          type="text"
          name="phone"
          placeholder="Phone No."
          label="Phone No."
        />
        <input
          value={address}
          onChange={handleInputChange}
          name="address"
          type="text"
          label="address"
          placeholder="Address"
        />
        <input
          value={email}
          onChange={handleInputChange}
          name="email"
          type="email"
          label="email"
          placeholder="Email"
        />
      </form>
    </div>
  );
};

export default SubscribeForm;
