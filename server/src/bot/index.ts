import TelegramBot from "node-telegram-bot-api";
import { UserService } from "../core/services/user.service";
import { UserRole } from "../core/models/user.model";
import { commands } from "./commands";

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is undefined");

export const bot = new TelegramBot(BOT_TOKEN);

commands(bot);

const ERROR_MESSAGES = {
  userNotFound: "User not found",
  accessDenied: "Access denied",
};

export const checkAdminUser = async (chatId: number) => {
  const existUser = await UserService.getUser(chatId.toString());
  if (!existUser) throw new Error(ERROR_MESSAGES.userNotFound);
  if (existUser.role !== UserRole.ADMIN)
    throw new Error(ERROR_MESSAGES.accessDenied);
  return existUser;
};
