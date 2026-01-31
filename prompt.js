import dotenv from "dotenv";
import { PromptTemplate} from "@langchain/core/prompts";

dotenv.config();

const prompt = new PromptTemplate({
    template: "Tell me about {topic} in a concise manner.",
    inputVariables: ["topic"]
})

const output = await prompt.format({
    topic: "virat kohli"
})

console.log(output);

