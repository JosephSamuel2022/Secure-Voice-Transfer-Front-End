import React from "react";

import { Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import HelloComponent from "./HelloComponent";
import io from "socket.io-client";
import FileShare from "./FileShare";

const socket = io.connect("http://localhost:3001");

function App() {
	return (
		<Routes>
			<Route path='/' element={<Login />} />
			<Route path='/plan' element={<HelloComponent />} />
			<Route path='/register' element={<Register />} />
			<Route path='/file' element={<FileShare socket={socket} />} />
		</Routes>
	);
}

export default App;
