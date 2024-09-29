import axios from "axios";
// import { SocksProxyAgent } from "socks-proxy-agent";

// // socks5 代理
// const socks5Agent = new SocksProxyAgent("socks5://127.0.0.1:7898");
// axios.defaults.httpsAgent = socks5Agent;
// axios.defaults.proxy = false;
// axios.get("https://ipinfo.io").then((res) => console.log(res.data.ip));

const config = {
  DEEPL_BASE_URL: "https://www2.deepl.com/jsonrpc",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    "x-app-os-name": "iOS",
    "x-app-os-version": "16.3.0",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "x-app-device": "iPhone13,2",
    "User-Agent": "DeepL-iOS/2.9.1 iOS 16.3.0 (iPhone13,2)",
    "x-app-build": "510265",
    "x-app-version": "2.9.1",
    Connection: "keep-alive",
  },
};

const getICount = (translateText) => (translateText || "").split("i").length - 1;

const getRandomNumber = (min = 8300000, max = 8399998) =>
  Math.floor(Math.random() * (max - min + 1)) + min * 1000;

const getTimestamp = (iCount) => {
  const ts = Date.now();
  return iCount === 0 ? ts : ts - (ts % (iCount + 1)) + (iCount + 1);
};

const translate = async (
  text = "Error: The original text cannot be empty!",
  sourceLang = "AUTO",
  targetLang = "ZH",
  alternativeCount = 0,
  printResult = false
) => {
  const iCount = getICount(text);
  const id = getRandomNumber();
  alternativeCount = Math.max(Math.min(3, alternativeCount), 0);

  const postData = {
    jsonrpc: "2.0",
    method: "LMT_handle_texts",
    id: id,
    params: {
      texts: [{ text: text, requestAlternatives: alternativeCount }],
      splitting: "newlines",
      lang: {
        source_lang_user_selected: sourceLang.toUpperCase(),
        target_lang: targetLang.toUpperCase(),
      },
      timestamp: getTimestamp(iCount),
    },
  };

  let postDataStr = JSON.stringify(postData);
  postDataStr = postDataStr.replace(
    '"method":"',
    id % 29 === 0 || id % 13 === 0 ? '"method" : "' : '"method": "'
  );

  try {
    const response = await axios.post(config.DEEPL_BASE_URL, postDataStr, {
      headers: config.headers,
      timeout: 5000,
    });

    if (response.status === 429) {
      throw new Error("Too many requests, temporarily blocked by DeepL.");
    }

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = {
      text: response.data.result.texts[0].text,
      alternatives: response.data.result.texts[0].alternatives.map((alt) => alt.text),
    };

    if (printResult) {
      console.log(result);
    }

    return result;
  } catch (err) {
    console.error("Translation error:", err.message);
    throw new Error("Translation request failed.");
  }
};

export { translate };
