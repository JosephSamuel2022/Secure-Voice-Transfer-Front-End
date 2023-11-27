import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { parse } from "node-html-parser";
import CryptoJS from "crypto-js";
import {
	MDBBtn,
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBRadio,
	MDBInput,
	MDBIcon,
	MDBCheckbox,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useState, useRef } from "react";
import { database } from "./firebase-config";
import { getDatabase, ref, set, get } from "firebase/database";

function Register() {
	const navigate = useNavigate();

	const [pid, setPid] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const [pidError, setPidError] = useState(false);
	const [nameError, setNameError] = useState(false);

	const [passwordError, setPasswordError] = useState(false);
	const [patientError, setPatientError] = useState(false);

	const [termsAgreed, setTermsAgreed] = useState(false);

	const generateMD5Hash = (inputString) => {
		const hash = CryptoJS.MD5(inputString).toString(CryptoJS.enc.Hex);
		return hash;
	};

	const handleRegister = async () => {
		// Prepare the data to be sent to the API
		if (!pid || !name || !password) {
			if (!pid) setPidError(true);
			if (!name) setNameError(true);

			if (!password) setPasswordError(true);
			if (!termsAgreed) setTermsError(true);
			return;
		}
		if (termsAgreed) {
			const userData = {
				name: name,
				password: password,
			};

			try {
				setPatientError(false);

				// Get a reference to the "users" node in your Firebase Realtime Database
				const tpassword = generateMD5Hash(password);
				const db = getDatabase();
				set(ref(db, "users/" + pid), {
					name: name,
					password: tpassword,
				});
				// Check if the user already exists
				// const userSnapshot = await get(ref(usersRef, pid));

				// if (userSnapshot.exists()) {
				// 	setPatientError(true);
				// } else {
				console.log("Bye");
				// User doesn't exist, so register them
				// await set(ref(usersRef, pid), userData); // Store user data under the phone number (pid)
				// await db.ref("./users/" + pid).set(userData);
				navigate("/");
				// }
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	function handleSwitchToLogin() {
		navigate("/");
	}
	function handleGenderChange(e) {
		setGender(e.target.value);
	}

	function handleDateChange(date) {
		setDateOfBirth(date);
	}

	function handlePidChange(e) {
		setPid(e.target.value);
		const inputValue = e.target.value.trim();
		if (inputValue === "") {
			setPidError(true);
		} else {
			setPidError(false);
		}
	}

	function handlePasswordChange(e) {
		setPassword(e.target.value);
		const inputValue = e.target.value.trim();
		if (inputValue === "") {
			setPasswordError(true);
		} else {
			setPasswordError(false);
		}
	}

	function handleNameChange(e) {
		setName(e.target.value);
		const inputValue = e.target.value.trim();
		if (inputValue === "") {
			setNameError(true);
		} else {
			setNameError(false);
		}
	}

	function toggleDatePicker() {
		if (datePickerRef.current) {
			datePickerRef.current.setOpen(true);
		}
	}
	const handlePidBlur = () => {
		if (!pid) setPidError(true);
		else setPidError(false);
	};

	const handleNameBlur = () => {
		if (!name) setNameError(true);
		else setNameError(false);
	};

	const handlePasswordBlur = () => {
		if (!password) setPasswordError(true);
		else setPasswordError(false);
	};

	function hasErrors() {
		return !!nameError || !!pidError || !!passwordError;
	}

	return (
		<MDBContainer fluid>
			<MDBRow>
				<MDBCol sm='6'>
					<div className='d-flex flex-row logo-containerr'>
						<span className='h1 fw-bold mb-0 tempd'>Secure Voice Transfer</span>
					</div>

					<div className='d-flex flex-column justify-content-center align-items-center login-containerr'>
						<h3
							className='fw-normal mb-3 ps-5 pb-3'
							style={{ letterSpacing: "1px" }}>
							Register
						</h3>

						<div className='d-flex flex-row align-items-center mb-4 w-50'>
							<MDBIcon fas icon='id-card-alt me-3' size='lg' />
							<MDBInput
								label='Phone Number'
								id='form0'
								type='text'
								size='lg'
								onChange={handlePidChange}
								onBlur={handlePidBlur}
							/>

							{pidError && <div className='error-text'>*</div>}
						</div>
						<div className='d-flex flex-row align-items-center mb-4 w-50'>
							<MDBIcon fas icon='user me-3' size='lg' />
							<MDBInput
								label='Name'
								id='form2'
								type='text'
								size='lg'
								onChange={handleNameChange}
								onBlur={handleNameBlur}
							/>
							{nameError && <div className='error-text'>*</div>}
						</div>

						<div className='d-flex flex-row align-items-center mb-4 w-50'>
							<MDBIcon fas icon='lock me-3' size='lg' />
							<MDBInput
								label='Password'
								id='form3'
								type='password'
								size='lg'
								onChange={handlePasswordChange}
								onBlur={handlePasswordBlur}
							/>
							{passwordError && <div className='error-text'>*</div>}
						</div>

						<div className='mb-2'>
							<MDBCheckbox
								name='flexCheck'
								value=''
								id='flexCheckDefault'
								label='I agree all statements in Terms of service'
								checked={termsAgreed}
								onChange={() => setTermsAgreed(!termsAgreed)}
								disabled={!pid || !name || !password}
							/>
						</div>
						{patientError && (
							<div className='error-text'>Patient ID already registered</div>
						)}
						<MDBBtn
							className='mb-4'
							size='lg'
							onClick={handleRegister}
							disabled={!termsAgreed || hasErrors()}>
							Register
						</MDBBtn>
						<p className='ms-5'>
							Already have an account?{" "}
							<a href='/' className='link-info' onClick={handleSwitchToLogin}>
								Login here
							</a>
						</p>
					</div>
				</MDBCol>
				<MDBCol sm='6' className='d-none d-sm-block px-0'>
					<img
						src='/images/voice.png'
						alt='Login image'
						className='w-100'
						style={{ objectFit: "cover", objectPosition: "left" }}
					/>
				</MDBCol>
			</MDBRow>
		</MDBContainer>
	);
}

export default Register;
