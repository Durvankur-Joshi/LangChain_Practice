import dotenv from "dotenv";
import { LLMChain} from "@langchain/classic/chains";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate} from "@langchain/core/prompts";


dotenv.config();

const model = new ChatGoogleGenerativeAI({
    model:"gemini-3-flash-preview",
    temperature:0.7,
});

const prompt = new PromptTemplate({
    template: "Explain {topic} in simple words for a beginner.",
    inputVariables: ["topic"]
})

const chain = new LLMChain({
    llm: model,
    prompt: prompt
})

const res = await chain.invoke({
    topic: "RAG"
})

console.log(res);