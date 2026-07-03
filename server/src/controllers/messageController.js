import { env } from '../config/env.js';
import { createMessage, listMessages } from '../repositories/messageRepository.js';
import { validateMessagePayload } from '../middleware/validateMessage.js';

export async function getMessages(req, res, next) {
  try {
    const messages = await listMessages({ limit: req.query.limit || env.messageFetchLimit });
    res.json({ data: messages });
  } catch (error) {
    next(error);
  }
}

export async function postMessage(req, res, next) {
  try {
    const validation = validateMessagePayload(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Invalid message payload.', errors: validation.errors });
    }

    const message = await createMessage(validation.value);
    const io = req.app.get('io');
    io?.emit('message:new', message);

    res.status(201).json({ data: message });
  } catch (error) {
    next(error);
  }
}
