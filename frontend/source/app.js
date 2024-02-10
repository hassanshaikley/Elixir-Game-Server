#!/usr/bin/env node

import React, { Fragment, useEffect } from 'react';
import { Text, useInput } from 'ink';
import dgram from 'dgram'
import { render } from 'ink';
import { World } from './world.js';
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './store.js';
import { increment } from './counterSlice.js';
import { addPlayer } from './playerSlice.js';



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
	const dispatch = useDispatch()

	useEffect(() => {
		console.log("Adding player")
		// dispatch(addPlayer(localPlayer))

	}, [])

	const players = useSelector((state) => state.players.players)
	const localPlayer = useSelector((state) => state.localPlayer)

	const count = useSelector((state) => state.counter.value)

	console.log(localPlayer)

	useInput((input, key) => {

		if (input === 'q') {
			// Exit program
		}

		if (input === 'd') {

			dispatch(increment())
		}
	});

	console.log("rendering")






	return (
		<Fragment>
			<Text>{count}</Text>
			<World players={players} />

		</Fragment>
	);
}





render(
	<Provider store={store}>
		<App />
	</Provider>);
