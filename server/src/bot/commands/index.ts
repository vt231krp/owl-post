import TelegramBot from "node-telegram-bot-api";
import { start } from "./actions/start.command";
import { sendAll } from "./actions/send-all.command";
import { stats } from "./actions/stats.command";
import { sendAllHandle } from "./actions/send-all-handle.command";

export const commands = (bot: TelegramBot) => {
  bot.on("message", async (msg) => {
    const msgText = msg.text;

    if (!msgText) return;

    switch (true) {
      case msgText.startsWith("/start"):
        return start(bot, msg);
      case msgText === "/sendall":
        return sendAll(bot, msg);
      case msgText.startsWith("/sendall -"):
        return sendAllHandle(bot, msg);
      case msgText === "/stats":
        return stats(bot, msg);
      default:
        break;
    }
  });
};
