import TelegramBot, { Message } from "node-telegram-bot-api";
import { UserService } from "../../../core/services/user.service";
import { HydratedDocument } from "mongoose";
import { IUser } from "../../../core/models/user.model";

const WELCOME_MESSAGE = `
🦉 Welcome to Owl Post!
Tap "Open" below to start managing your temporary emails. 💌
`;

export const start = async (bot: TelegramBot, event: Message) => {
  try {
    const chatId = event.chat.id;
    const msgText = event.text;

    await UserService.authUser({
      tgId: chatId.toString(),
    } as HydratedDocument<IUser>);

    await bot.sendMessage(chatId, WELCOME_MESSAGE);
  } catch (err) {
    console.log(err);
  }
};
