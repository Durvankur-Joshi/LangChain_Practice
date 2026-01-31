import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  temperature: 0.7,
});

const response = await model.invoke(
  "Explain LangChain in one sentence like I am a beginner"
);

console.log(response.content);
