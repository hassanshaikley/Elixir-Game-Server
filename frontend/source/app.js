#!/usr/bin/env node

import React, { useEffect } from 'react';
import { Text, useInput } from 'ink';
import dgram from 'dgram'
import { render } from 'ink';
import { World } from './world.js';

const localPlayer = { name: "Some Guy", id: "123", x: 0, z: 0 }

export default function App({ name = 'Stranger' }) {
	var s = dgram.createSocket('udp4');

	const toSend = JSON.stringify({ hello: "World" })

	s.send(Buffer.from(toSend), 5355, 'localhost')

	s.addListener("hello", () => {
		console.log("Goodbye")
	})
	s.addListener("message", (body) => {
		const b = body.toString()
		console.log(b)
		const parsed = JSON.parse(b)
		console.log(parsed)
	})

	const players = [localPlayer]


	useInput((input, key) => {

		if (input === 'q') {
			// Exit program
		}

		if (key === 'd') {
			localPlayer.x += 1
		}
	});

	console.log("Re rendering")






	return (
		<World players={players} />
	);
}





render(<App />);
