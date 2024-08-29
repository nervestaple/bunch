import type * as Party from 'partykit/server';
import { Vector2 } from 'three';
import { match } from 'ts-pattern';

import { MAX_UPDATE_MS } from './constants';
import { Inputs, MessageFromClient, type InputType } from './schema';

const DISTANCE_MULTIPLIER = 0.1;

const DIRECTION_VECTORS: { [key in InputType]: Vector2 } = {
  up: new Vector2(0, 1),
  down: new Vector2(0, -1),
  left: new Vector2(-1, 0),
  right: new Vector2(1, 0),
};

export default class WebSocketServer implements Party.Server {
  playerPositions: Record<string, { x: number; y: number }>;
  playerData: Record<string, { lastUpdate: number }>;

  interval = setInterval(() => {
    const playerPositionsOfConnectedPlayers = Object.fromEntries(
      Object.entries(this.playerPositions).filter(([id]) =>
        this.room.getConnection(id)
      )
    );

    const updateMessage = JSON.stringify({
      type: 'update',
      positions: playerPositionsOfConnectedPlayers,
    });
    this.room.broadcast(updateMessage);
  }, 100);

  constructor(readonly room: Party.Room) {
    this.playerPositions = {};
    this.playerData = {};
  }

  onConnect(connection: Party.Connection) {
    console.log(`${connection.id} connected`);
    this.playerPositions[connection.id] = {
      x: 0,
      y: 0,
    };
    this.playerData[connection.id] = { lastUpdate: Date.now() };
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const parsedJson = JSON.parse(message);
      const { data, error } = MessageFromClient.safeParse(parsedJson);
      if (error) {
        console.error(error);
        return;
      }

      match(data)
        .with({ type: 'input' }, ({ inputs }) =>
          this.handleUserInput(sender.id, inputs)
        )
        .with({ type: 'ping' }, ({ time }) => {
          sender.send(JSON.stringify({ type: 'pong', time }));
        })
        .exhaustive();
    } catch (error) {
      console.warn(error);
    }

    console.log(`${sender.id} says: ${message}`);
  }

  handleUserInput(id: string, inputs: Inputs) {
    const now = Date.now();
    const lastUpdate = this.playerData[id].lastUpdate;
    if (lastUpdate - now > MAX_UPDATE_MS) {
      console.warn(`${id} is sending updates too quickly. Ignoring this one.`);
      return;
    }

    const inputDirections = Object.entries(inputs)
      .filter(([, value]) => value)
      .map(([key]) => DIRECTION_VECTORS[key as InputType]); // TODO: Object.entries/keys doesn't respect types

    const directionSum = inputDirections.reduce(
      (sum, direction) => sum.add(direction),
      new Vector2()
    );

    const normalizedDirection = directionSum
      .normalize()
      .multiplyScalar(DISTANCE_MULTIPLIER);

    this.playerPositions[id].x += normalizedDirection.x;
    this.playerPositions[id].y += normalizedDirection.y;
    this.playerData[id].lastUpdate = Date.now();
  }
}
