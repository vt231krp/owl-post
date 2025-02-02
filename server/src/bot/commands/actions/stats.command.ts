import TelegramBot, { Message } from "node-telegram-bot-api";
import { UserService } from "../../../core/services/user.service";

export const stats = async (bot: TelegramBot, event: Message) => {
  try {
    const chatId = event.chat.id;
    const numberOfUsers = (await UserService.getAllUsers()).length;
    await bot.sendMessage(chatId, `📊 Number of users: ${numberOfUsers}`);
  } catch (err) {
    console.error(err);
  }
};
