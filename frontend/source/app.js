#!/usr/bin/env node

import React from 'react';
import { Text } from 'ink';
import dgram from 'dgram'
import { render } from 'ink';

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

	return (
		<Text>
			Hello, <Text color="green">{name}</Text> I just sent a UDP Packet.
		</Text>
	);
}





render(<App />);
