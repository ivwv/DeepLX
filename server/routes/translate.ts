import { defineEventHandler } from "h3";
import { translate } from "../utils/translate";

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    // GET 请求逻辑
    return {
      code: 200,
      message:
        "Welcome to the DeepL Free API. Please POST to '/translate'. This program is published in accordance with the terms of GNU/AGPLv3. Visit 'https://github.com/ivwv/DeepLX' for more information.",
    };
  }

  if (event.method === "POST") {
    const startTime = Date.now();

    const bodys = await readBody(event); // 从请求体中读取数据
    const { text, source_lang, target_lang, alt_count } = bodys;

    if (!text) {
      const duration = Date.now() - startTime;
      console.log(`[LOG] ${new Date().toISOString()} | 404 | ${duration}ms | POST "translate"`);
      return {
        code: 404,
        message: "Path not found",
      };
    }

    try {
      const result = await translate(text, source_lang, target_lang, alt_count);
      const duration = Date.now() - startTime;
      console.log(`[LOG] ${new Date().toISOString()} | 200 | ${duration}ms | POST "translate"`);

      const responseData = {
        code: 200,
        data: result.text,
        id: Math.floor(Math.random() * 10000000000),
        method: "Free",
        source_lang,
        target_lang,
        alternatives: result.alternatives,
      };

      return responseData;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(
        `[ERROR] ${new Date().toISOString()} | 500 | ${duration}ms | POST "translate" | ${
          error.message
        }`
      );
      return {
        code: 500,
        message: "Translation failed",
        error: error.message,
      };
    }
  }

  return {
    code: 405,
    message: "Method not allowed",
  };
});
