import React, { useState } from "react";
import { firebase } from "./api/firebase";
import "./subscribe.css";

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

  const [loading, setloading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState();
  const [initialStep, setInitialStep] = useState(true);
  const [imageFile, setImageFile] = useState();

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

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("[SENDING PHONE NUMBER]");
    setupRecaptcha();

    console.log("window.recaptchaVerifier", window.recaptchaVerifier);

    const phoneNumber = phone;
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

  const confirmCode = async (e) => {
    e.preventDefault();
    if (confirmationResult && otp) {
      console.log("confirmationResult..:", confirmationResult);
      console.log("codeConfirmation..:", otp);

      try {
        setloading(true);
        const result = await confirmationResult.confirm(otp);
        console.log("[REGISTRATION SUCCESS]");
        console.log("result", result.user?.uid);
        //
        // Submit form with uploaded Image. All info is stored in state
        //
        setComplete(true);
        setloading(false);
      } catch (error) {
        console.log("error..:", error);
        alert("Invalid OTP");
        setloading(false);
      }
    }
  };

  const nextStep = () => {
    setInitialStep(false);
  };

  const handleChangeImage = (event) => {
    setImageFile(URL.createObjectURL(event.target.files[0]));
  };

  const handleFormSubmit = () => {
    // submit data without image
  };

  // const handleFormSubmitWithImage = () => {
  //   //call this inside confirm code.
  // };

  return (
    <div className="subscribe-form">
      {initialStep ? (
        <form onSubmit={handleFormSubmit} className="step-1">
          <h1>Subscribe Us</h1>
          <input
            value={name}
            onChange={handleInputChange}
            name="name"
            type="text"
            label="name"
            placeholder="Name"
          />
          <input
            value={email}
            onChange={handleInputChange}
            name="email"
            type="email"
            label="email"
            placeholder="Email"
          />
          <textarea
            value={address}
            onChange={handleInputChange}
            name="address"
            type="text"
            label="address"
            placeholder="Address (Optional)"
          />

          <div className="btn-group">
            <button className="upload-btn" onClick={nextStep}>
              Upload Image
            </button>
            <button className="submit-btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      ) : (
        <div className="step-2">
          <h1>Upload Image</h1>
          {!complete && (
            <form className="phone-form">
              <div id="recaptcha-container"></div>
              <label htmlFor="phone">Enter Phone Number:</label>
              <div className="phone-grp">
                <input
                  value={phone}
                  onChange={handleInputChange}
                  type="text"
                  name="phone"
                  disabled={!!captchaSolved}
                  placeholder="Ex- +918888899999 "
                  label="Phone No."
                />

                <button onClick={onSubmit} className="otp-btn">
                  {" "}
                  Send OTP{" "}
                </button>
              </div>
            </form>
          )}
          {captchaSolved && !complete && (
            <form className="otp-form">
              <input
                value={otp}
                onChange={handleInputChange}
                name="otp"
                type="text"
                label="otp"
                className="otp-input"
                placeholder="OTP"
              />
              {imageFile && (
                <div className="img-container">
                  <img
                    src={imageFile}
                    alt="tree-user-uploaded"
                    width="200px"
                    className="uploaded-img"
                  />
                </div>
              )}
              <input
                onChange={(event) => handleChangeImage(event)}
                id="imageFile"
                className="custom-file-input"
                type="file"
              />
              <div style={{ display: "flex" }}>
                <button onClick={confirmCode} className="verify-btn">
                  Verify & Submit
                </button>
              </div>
            </form>
          )}
          {complete && <h3>Added Successfully</h3>}

          {loading && <div>Loading...</div>}
        </div>
      )}
    </div>
  );
};

export default SubscribeForm;
