import React, { useState } from "react";
import {
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBInput,
	MDBBtn,
	MDBIcon,
	MDBDropdown,
	MDBDropdownToggle,
	MDBDropdownMenu,
	MDBDropdownItem,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { database } from "./firebase-config";
import { getDatabase, ref, get } from "firebase/database";
import CryptoJS from "crypto-js";

import "./App.css";

function Login() {
	const [selectedRole, setSelectedRole] = useState("client");
	const navigate = useNavigate();
	const [patientError, setPatientError] = useState(false);

	function handleSwitchToRegister() {
		navigate("/register");
	}
	const handleRoleChange = (value) => {
		setSelectedRole(value);
	};
	const [pid, setPid] = useState(0);
	const [password, setPassword] = useState(0);

	const generateMD5Hash = (inputString) => {
		const hash = CryptoJS.MD5(inputString).toString(CryptoJS.enc.Hex);
		return hash;
	};

	const handleLogin = async () => {
		try {
			setPatientError(false);

			const db = getDatabase();
			const locationsRef = ref(db, "users/" + pid);

			const snapshot = await get(locationsRef);

			if (snapshot.exists()) {
				const userData = snapshot.val();
				console.log(userData.password);

				// Check if the user exists and the password matches
				if (String(userData.password) === generateMD5Hash(password)) {
					console.log("hello");
					const userName = userData.name;

					// Store the user's ID in sessionStorage
					sessionStorage.setItem("userId", userName);
					navigate("/file");
				} else {
					setPatientError(true);
				}
			} else {
				setPatientError(true);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	function handlePidChange(e) {
		setPid(e.target.value);
	}

	function handlePasswordChange(e) {
		setPassword(e.target.value);
	}
	return (
		<MDBContainer fluid>
			<MDBRow>
				<MDBCol sm='6'>
					<div className='d-flex flex-row logo-container'>
						{/* <img src='/images/taxi.avif' className='img-fluid me-3' /> */}
						<span className='h1 fw-bold mb-0 tempc'>Secure Voice Transfer</span>
					</div>

					<div className='d-flex flex-column justify-content-center align-items-center h-custom-2  pt-4 login-container'>
						<h3
							className='fw-normal mb-3 ps-5 pb-3'
							style={{ letterSpacing: "1px" }}>
							Log in
						</h3>

						<div className='d-flex flex-row align-items-center mb-4 w-50'>
							<MDBIcon fas icon='id-card-alt me-3' size='lg' />
							<MDBInput
								label='Phone Number'
								id='form0'
								type='tel'
								size='lg'
								onChange={handlePidChange}
							/>
						</div>
						<div className='d-flex flex-row align-items-center mb-4 w-50'>
							<MDBIcon fas icon='lock me-3' size='lg' />
							<MDBInput
								label='Password'
								id='form3'
								type='password'
								size='lg'
								onChange={handlePasswordChange}
							/>
						</div>

						<div className='d-flex flex-row align-items-center mb-4 w-50'>
							<MDBIcon fas icon='user me-3' size='lg' />
							<MDBDropdown>
								<MDBDropdownToggle>
									{selectedRole === "client" ? "Client" : "Server"}
								</MDBDropdownToggle>
								<MDBDropdownMenu>
									<MDBDropdownItem onClick={() => handleRoleChange("client")}>
										Client
									</MDBDropdownItem>
									<MDBDropdownItem onClick={() => handleRoleChange("server")}>
										Server
									</MDBDropdownItem>
								</MDBDropdownMenu>
							</MDBDropdown>
						</div>
						{patientError && (
							<div className='error-text'>Invalid Patient Id or Password</div>
						)}
						<MDBBtn
							className='mb-4 mt-2'
							size='lg'
							onClick={handleLogin}
							disabled={!pid || !password}>
							Login
						</MDBBtn>
						<p className='small mb-5 pb-lg-3 d-flex justify-content-center'>
							<a
								className='text-muted'
								href='/forgot'
								onClick={() => {
									navigate("/forgot");
								}}>
								Forgot password?
							</a>
						</p>
						<p className='d-flex justify-content-center'>
							Don't have an account?{" "}
							<a
								href='/register'
								className='link-info'
								onClick={handleSwitchToRegister}>
								Register here
							</a>
						</p>
					</div>
				</MDBCol>
				<MDBCol sm='6' className='d-none d-sm-block px-0'>
					<img
						src='/images/voice.png'
						alt='Login image'
						className='custom-height'
						style={{ objectFit: "cover", objectPosition: "left" }}
					/>
				</MDBCol>
			</MDBRow>
		</MDBContainer>
	);
}

export default Login;
