import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import axios from "axios";

const FileShare = ({ socket }) => {
	const [enteredNumber, setEnteredNumber] = useState("");
	const [receivedNumber, setReceivedNumber] = useState("");
	const [currentSocketId, setCurrentSocketId] = useState("");
	const [uploadedFile, setUploadedFile] = useState(null);
	const [downloadedFile, setDownloadedFile] = useState(null);
	const p = 23;
	const g = 9;
	const navigate = useNavigate();
	useEffect(() => {
		const username = sessionStorage.getItem("userId");
		if (!username) {
			navigate("/");
		}

		if (!socket || !socket.id) {
			navigate("/");
		}
	}, [navigate, socket]);

	const sendNumber = () => {
		if (enteredNumber !== "") {
			const gPowerAmodP = g ** enteredNumber % p;
			socket.emit("send_number", { number: gPowerAmodP });
		}
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		setUploadedFile(file); // Store the uploaded file in state
		// Implement file upload logic using socket.emit
	};

	const handleUploadButtonClick = () => {
		document.getElementById("file-upload").click();
	};

	const sendToBackend = async () => {
		if (receivedNumber && uploadedFile) {
			const formData = new FormData();
			formData.append("number", receivedNumber);
			formData.append("file", uploadedFile);

			try {
				const response = await axios.post(
					"http://127.0.0.1:5000/upload",
					formData
				);

				if (response.status === 200) {
					// Handle success (if needed)
					console.log("Data sent to backend successfully");
				} else {
					// Handle failure (if needed)
					console.error("Failed to send data to backend");
				}
			} catch (error) {
				console.error("Error sending data to backend:", error);
			}
		} else {
			console.error("Received number or uploaded file is missing");
		}
	};

	const handleNumberChange = (event) => {
		const newNumber = event.target.value;
		setEnteredNumber(newNumber); // Update enteredNumber state on input change
		console.log("New enteredNumber:", newNumber); // Update enteredNumber state on input change
	};

	const handleReceiveButtonClick = async () => {
		try {
			const response = await axios.post(
				"http://127.0.0.1:5000/download",
				{ number: receivedNumber },
				{
					responseType: "blob", // Set responseType to 'blob' to receive binary data
				}
			);
			console.log(response);

			// Create a temporary URL for the downloaded file
			const url = window.URL.createObjectURL(new Blob([response.data]));

			// Set the downloaded file URL to state
			setDownloadedFile(url);

			// Create an anchor element
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "decrypted_audio_file.wav"); // Set desired file name here
			document.body.appendChild(link);

			// Trigger a click event to simulate download
			link.click();

			// Clean up the URL and anchor element
			link.parentNode.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error fetching decrypted audio:", error);
		}
	};

	useEffect(() => {
		setCurrentSocketId(socket.id);

		socket.on("receive_number", (data) => {
			if (socket.id !== data.senderId && enteredNumber !== "") {
				// setReceivedNumber(data.number);
				console.log(data.number);
				console.log(enteredNumber);
				setReceivedNumber(data.number ** enteredNumber % p);
			}
		});

		return () => {
			socket.off("receive_number");
		};
	}, [socket, enteredNumber]);

	return (
		<div className='file-share-container'>
			<div className='input-section'>
				<input
					type='number'
					value={enteredNumber}
					placeholder='Enter private key'
					onChange={handleNumberChange}
				/>
				<button onClick={sendNumber}>Send Public Key</button>
			</div>

			<div className='file-section'>
				{receivedNumber && (
					<p className='received-number'>Received Number: {receivedNumber}</p>
				)}
				{uploadedFile && (
					<p className='file-name'>Uploaded File: {uploadedFile.name}</p>
				)}
				<input
					id='file-upload'
					type='file'
					onChange={handleFileUpload}
					style={{ display: "none" }}
				/>
				<button className='file-upload-label' onClick={handleUploadButtonClick}>
					Upload File
				</button>
				<br></br>
				<br></br>
				<button onClick={sendToBackend}>Send File</button>
				<br></br>
				<br></br>
				<button
					className='file-receive-button'
					onClick={handleReceiveButtonClick}>
					Receive File
				</button>
			</div>
		</div>
	);
};

export default FileShare;
