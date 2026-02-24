const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", (error) => console.log("PAGE ERROR:", error.message));
  page.on("requestfailed", (request) =>
    console.log("REQUEST FAILED:", request.url(), request.failure().errorText),
  );

  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
    console.log("Page loaded. HTML:");
    const html = await page.content();
    console.log(html.substring(0, 500) + "...");

    // Check root
    const rootContent = await page.$eval("#root", (el) => el.innerHTML);
    console.log("Root content length:", rootContent.length);
    console.log("Root content:", rootContent.substring(0, 200));
  } catch (err) {
    console.error("Script error:", err);
  } finally {
    await browser.close();
  }
})();
