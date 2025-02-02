import TelegramBot, { Message } from "node-telegram-bot-api";
import { checkAdminUser } from "../..";
import { UserService } from "../../../core/services/user.service";

export const sendAllHandle = async (bot: TelegramBot, event: Message) => {
  const chatId = event.chat.id;
  const msgText = event.text;
  try {
    await checkAdminUser(chatId);
  } catch (err) {
    return await bot.sendMessage(chatId, err.message);
  }

  const parts = msgText!.split(" ");
  const isPhoto = parts.includes("-p");
  const photoUrl = isPhoto ? parts[2] : null;

  if (isPhoto && !photoUrl) {
    return await bot.sendMessage(chatId, "Please provide a valid photo URL.");
  }

  const message = parts.includes("-m")
    ? parts.slice(parts.indexOf("-m") + 1).join(" ")
    : null;
  if (!message) {
    return await bot.sendMessage(chatId, "Please provide a message.");
  }

  const users = await UserService.getAllUsers();
  let counter: number = 0;

  for (const user of users) {
    try {
      if (isPhoto && photoUrl) {
        await bot.sendPhoto(parseInt(user.tgId), photoUrl, {
          parse_mode: "Markdown",
          caption: message,
        });
      } else {
        await bot.sendMessage(parseInt(user.tgId), message, {
          parse_mode: "Markdown",
        });
      }
      counter += 1;
    } catch (err) {
      console.error(err);
    }
  }

  await bot.sendMessage(chatId, `Sending completed. Sent to ${counter} users`);
};
