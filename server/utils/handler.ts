import { translate } from "./translate";

const get = (ctx) => {
  return ctx.json({
    code: 200,
    message:
      "Welcome to the DeepL Free API. Please POST to '/translate'. This program is published in accordance with the terms of GNU/AGPLv3. Visit 'https://github.com/guobao2333/DeepLX-Serverless' for more information.",
  });
};

const post = async (ctx) => {
  const startTime = Date.now();

  const bodys = await ctx.req.json();
  const { text, source_lang, target_lang, alt_count } = bodys;
  if (!text) {
    const duration = Date.now() - startTime;
    console.log(`[LOG] ${new Date().toISOString()} | 404 | ${duration}ms | POST "translate"`);
    return ctx.json({ code: 404, message: "Path not found" });
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

    return ctx.json(responseData);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[ERROR] ${new Date().toISOString()} | 500 | ${duration}ms | POST "translate" | ${
        error.message
      }`
    );
    return ctx.json({ code: 500, message: "Translation failed", error: error.message });
  }
};

export { get, post };
