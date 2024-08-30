'use client';

import { EventEmitter } from 'events';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

import { animated, useSpring } from '@react-spring/three';
import { isEqual, pickBy } from 'lodash-es';
import usePartySocket from 'partysocket/react';
import { match } from 'ts-pattern';

import { useFirebase } from '~/components/FirebaseProvider';
import { MAX_UPDATE_MS } from '~/server/constants';
import { MessageFromServer } from '~/server/schema';

export default function Page() {
  const { currentUser } = useFirebase();

  const updateEventEmitter = useRef<EventEmitter>(new EventEmitter());
  const [playerIds, setPlayerIds] = useState<Set<string>>(new Set());

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST,
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

            Object.entries(positions).forEach(([id, { x, y }]) => {
              updateEventEmitter.current.emit(id, { x, y });
            });
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
        <Player key={id} id={id} updateEventEmitter={updateEventEmitter} />
      ))}
    </>
  );
}

function Player({
  id,
  updateEventEmitter,
}: {
  id: string;
  updateEventEmitter: MutableRefObject<EventEmitter>;
}) {
  const [{ position }, api] = useSpring(() => ({
    position: [0, 0],
    config: { mass: 1, tension: 300, friction: 20 },
  }));

  useEffect(() => {
    const emitter = updateEventEmitter.current;
    function update({ x, y }: { x: number; y: number }) {
      api.start({ position: [x, y] });
    }

    emitter.on(id, update);
    return () => {
      emitter.off(id, update);
    };
  }, [id, updateEventEmitter, api]);

  return (
    <animated.mesh position={position.to((x, y) => [x, y, -50])}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="hotpink" />
    </animated.mesh>
  );
}
