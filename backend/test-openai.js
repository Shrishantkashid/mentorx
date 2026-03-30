const OpenAI = require("openai");
console.log("Type of OpenAI:", typeof OpenAI);
console.log("OpenAI keys:", Object.keys(OpenAI));
try {
  const client = new OpenAI({ apiKey: "test" });
  console.log("Client created successfully with constructor");
} catch (e) {
  console.log("Constructor failed:", e.message);
}
try {
  const client = new OpenAI.OpenAI({ apiKey: "test" });
  console.log("Client created successfully with OpenAI.OpenAI");
} catch (e) {
  console.log("OpenAI.OpenAI failed:", e.message);
}
