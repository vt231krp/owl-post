import TelegramBot, { Message } from "node-telegram-bot-api";
import { checkAdminUser } from "../..";

export const sendAll = async (bot: TelegramBot, event: Message) => {
  const chatId = event.chat.id;
  const msgText = event.text;

  try {
    await checkAdminUser(chatId);

    await bot.sendMessage(
      chatId,
      `
    Type "/sendall -m <your message>"
    Flags: 
      * m - message;
      * p - photo (optional).
    Example: "/sendall -p <url> -m <your message>"
          `
    );
  } catch (err) {
    console.error(err);
    await bot.sendMessage(chatId, err.message);
  }
};
