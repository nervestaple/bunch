import z from 'zod';

export const Inputs = z.object({
  up: z.boolean().optional(),
  down: z.boolean().optional(),
  left: z.boolean().optional(),
  right: z.boolean().optional(),
});
export type Inputs = z.infer<typeof Inputs>;
export type InputType = keyof Inputs;

export const InputMessage = z.object({
  type: z.literal('input'),
  inputs: Inputs,
});

export const PingMessage = z.object({
  type: z.literal('ping'),
  time: z.number(),
});

export const MessageFromClient = z.union([InputMessage, PingMessage]);

export type MessageFromClientType = z.infer<typeof MessageFromClient>;

// =====================================

export const ServerUpdate = z.object({
  type: z.literal('update'),
  positions: z.record(z.object({ x: z.number(), y: z.number() })),
});

export const PongMessage = z.object({
  type: z.literal('pong'),
  time: z.number(),
});

export const MessageFromServer = z.union([ServerUpdate, PongMessage]);
