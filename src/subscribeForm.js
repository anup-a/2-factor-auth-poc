import React, { useState, useEffect } from "react";
import { auth, firebase } from "./api/firebase";

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
  const [phonenumber, setPhonenumber] = useState("");

  const [loading, setloading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [codeConfirmation, setCodeConfirmation] = useState("");
  const [confirmationResult, setConfirmationResult] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const { name, phone, email, address, otp } = values;

  const setupRecaptcha = () => {
    try {
      console.log("[CREATING CAPTCHA VERIFIER]");
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: function (response) {
            console.log("[CAPTCHA RESOLVED]", response);
            setCaptchaSolved(true);
          },
        }
      );
    } catch (error) {
      console.log("error..:", error);
      setCaptchaSolved(false);
    }
  };

  const onSubmit = async () => {
    console.log("[SENDING PHONE NUMBER]");
    setupRecaptcha();

    console.log("window.recaptchaVerifier", window.recaptchaVerifier);

    const phoneNumber = "+917798558520";
    const appVerifier = window.recaptchaVerifier;

    if (appVerifier) {
      try {
        setloading(true);
        const confirmationResultResponse = await firebase
          .auth()
          .signInWithPhoneNumber(phoneNumber, appVerifier);
        setConfirmationResult(confirmationResultResponse);
        setloading(false);
      } catch (error) {
        console.log("Error(SMS not sent)..:", error);
        setloading(false);
      }
    }
  };

  const confirmCode = async () => {
    if (confirmationResult && codeConfirmation) {
      console.log("confirmationResult..:", confirmationResult);
      console.log("codeConfirmation..:", codeConfirmation);

      try {
        setloading(true);
        const result = await confirmationResult.confirm(codeConfirmation);
        console.log("[REGISTRATION SUCCESS]");
        console.log("result", result.user?.uid);
        setComplete(true);
        setloading(false);
      } catch (error) {
        console.log("error..:", error);
        setloading(false);
      }
    }
  };

  const changeCodeConfirmation = (event: any) => {
    const code = event.target.value;
    setCodeConfirmation(code);
  };

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

      <div className="new-app">
        <h1>POC - Firebase Phone Auth</h1>

        {!captchaSolved && (
          <form>
            <div id="recaptcha-container"></div>
            <input type="text" name="phoneNumber" />
            <input type="button" value="Cadastrar celular" onClick={onSubmit} />
          </form>
        )}
        {captchaSolved && !complete && (
          <form>
            <input
              type="text"
              name="codeConfirmation"
              onChange={changeCodeConfirmation}
            />
            <input type="button" value="Confirm code" onClick={confirmCode} />
          </form>
        )}
        {complete && <h3>Cadastro realizado com sucesso!</h3>}

        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
};

export default SubscribeForm;
