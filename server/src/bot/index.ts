import TelegramBot from "node-telegram-bot-api";
import { UserService } from "../core/services/user.service";
import { HydratedDocument } from "mongoose";
import { IUser, UserRole } from "../core/models/user.model";

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is undefined");

export const bot = new TelegramBot(BOT_TOKEN);

const ERROR_MESSAGES = {
  userNotFound: "User not found",
  accessDenied: "Access denied",
};

const WELCOME_MESSAGE = `
🦉 Welcome to Owl Post!
Tap "Open" below to start managing your temporary emails. 💌
`;

const checkAdminUser = async (chatId: number) => {
  const existUser = await UserService.getUser(chatId.toString());
  if (!existUser) throw new Error(ERROR_MESSAGES.userNotFound);
  if (existUser.role !== UserRole.ADMIN)
    throw new Error(ERROR_MESSAGES.accessDenied);
  return existUser;
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const msgText = msg.text;

  if (!msgText) return;

  if (msgText.startsWith("/start")) {
    try {
      await UserService.authUser({
        tgId: chatId.toString(),
      } as HydratedDocument<IUser>);

      await bot.sendMessage(chatId, WELCOME_MESSAGE);
    } catch (err) {
      console.log(err);
    }
  } else if (msgText == "/sendall") {
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
      `,
      );
    } catch (err) {
      console.error(err);
      await bot.sendMessage(chatId, err.message);
    }
  } else if (msgText.startsWith("/sendall")) {
    try {
      await bot.sendMessage(
        chatId,
        `
        Type "/sendall -m <your message>"
        Flags: 
          * m - message;
          * p - photo (optional).
        Example: "/sendall -p <url> -m <your message>"
      `,
      );
    } catch (err) {
      console.error(err);
    }
  } else if (msgText.startsWith("/sendall")) {
    try {
      await checkAdminUser(chatId);
    } catch (err) {
      await bot.sendMessage(chatId, err.message);
      return;
    }

    const parts = msgText.split(" ");
    const isPhoto = parts.includes("-p");
    const photoUrl = isPhoto ? parts[2] : null;

    if (isPhoto && !photoUrl) {
      await bot.sendMessage(chatId, "Please provide a valid photo URL.");
      return;
    }

    const message = parts.includes("-m")
      ? parts.slice(parts.indexOf("-m") + 1).join(" ")
      : null;
    if (!message) {
      await bot.sendMessage(chatId, "Please provide a message.");
      return;
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

    await bot.sendMessage(
      chatId,
      `Sending completed. Sent to ${counter} users`,
    );
  } else if (msgText == "/stats") {
    try {
      const numberOfUsers = (await UserService.getAllUsers()).length;
      await bot.sendMessage(chatId, `📊 Number of users: ${numberOfUsers}`);
    } catch (err) {
      console.error(err);
    }
  }
});
