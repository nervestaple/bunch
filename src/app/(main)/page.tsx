'use client';

import { MutableRefObject, useEffect, useRef, useState } from 'react';

import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { isEqual, pickBy } from 'lodash-es';
import usePartySocket from 'partysocket/react';
import { Vector3, type Mesh } from 'three';
import { match } from 'ts-pattern';

import { useFirebase } from '~/components/FirebaseProvider';
import { MAX_UPDATE_MS } from '~/server/constants';
import { MessageFromServer } from '~/server/schema';

export default function Page() {
  const { currentUser } = useFirebase();

  const [playerIds, setPlayerIds] = useState<Set<string>>(new Set());
  const playerPositions = useRef<Record<string, { x: number; y: number }>>({});

  const socket = usePartySocket({
    host: 'localhost:1999',
    room: 'world',
    id: currentUser?.uid,

    onOpen() {
      console.log('connected');
    },
    onMessage(e) {
      console.log('message', e.data);
      try {
        const parsedJson = JSON.parse(e.data);
        const { data, error } = MessageFromServer.safeParse(parsedJson);
        if (error) {
          console.error(error);
          return;
        }

        match(data)
          .with({ type: 'update' }, ({ positions }) => {
            const arePlayerIdsEqual = isEqual(
              playerIds,
              new Set(Object.keys(positions))
            );
            if (!arePlayerIdsEqual) {
              setPlayerIds(new Set(Object.keys(positions)));
            }
            playerPositions.current = positions;
          })
          .with({ type: 'pong' }, ({ time }) => {
            console.log('pong', time);
          })
          .exhaustive();
      } catch (error: unknown) {
        console.warn(e);
      }
    },
    onClose() {
      console.log('closed');
    },
    onError() {
      console.log('error');
    },
  });

  useEffect(() => {
    const keysDown = new Set<string>();

    function update() {
      if (keysDown.size === 0) {
        return;
      }

      const inputs = pickBy({
        up: keysDown.has('w') || keysDown.has('ArrowUp'),
        down: keysDown.has('s') || keysDown.has('ArrowDown'),
        left: keysDown.has('a') || keysDown.has('ArrowLeft'),
        right: keysDown.has('d') || keysDown.has('ArrowRight'),
      });

      if (Object.keys(inputs).length === 0) {
        return;
      }

      const message = JSON.stringify({
        type: 'input',
        inputs,
      });

      console.log('sending', message);
      socket.send(message);
    }

    const interval = setInterval(update, MAX_UPDATE_MS);

    function handleKeyDown(e: KeyboardEvent) {
      keysDown.add(e.key);
    }

    function handleKeyUp(e: KeyboardEvent) {
      keysDown.delete(e.key);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, [socket]);

  return (
    <>
      {[...playerIds].map((id) => (
        <Player key={id} id={id} playerPositions={playerPositions} />
      ))}
    </>
  );
}

function Player({
  id,
  playerPositions,
}: {
  id: string;
  playerPositions: MutableRefObject<Record<string, { x: number; y: number }>>;
}) {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    if (!ref.current) {
      return;
    }

    const myPosition = playerPositions.current[id];
    if (!myPosition) {
      return;
    }

    ref.current.position.x = myPosition.x;
    ref.current.position.y = myPosition.y;
  });

  return (
    <Sphere ref={ref} position={new Vector3(0, 0, -50)}>
      <meshStandardMaterial color="hotpink" />
    </Sphere>
  );
}
