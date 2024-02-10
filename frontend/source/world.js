#!/usr/bin/env node

import React, { Fragment, useEffect } from 'react';
import { Text, Newline } from 'ink';
import dgram from 'dgram'
import { render } from 'ink';

export function World({ players }) {


    const map = [
        [
            0, 0, 0, 0
        ],
        [
            0, 0, 0, 0
        ],
        [
            0, 0, 0, 0
        ]
    ]

    const playersArray = players.reduce((acc, player) => {

        if (!acc[player.x]) {
            acc[player.x] = []
        }
        if (!acc[player.x][player.z]) {
            acc[player.x][player.z] = []
        }
        acc[player.x][player.z] = player
        return acc
    }, [])





    return (
        <Text>
            {map.map((outer, outerIndex) => {
                return <Fragment key={outerIndex}>
                    {outer.map((inner, innerIndex) => {

                        if (playersArray[outerIndex] && playersArray[outerIndex][innerIndex]) {

                            return <Text key={playersArray[outerIndex][innerIndex].id}>P</Text>
                        } else {
                            return <Text key={`${outerIndex}-${innerIndex}`}>{inner}</Text>

                        }

                    })}
                    <Newline />
                </Fragment>

            })}

        </Text>
    );
}


