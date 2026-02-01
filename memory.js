import dotenv from 'dotenv';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { InMemoryStore } from '@langchain/langgraph';

dotenv.config();

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-3-flash-preview',
    temperature: 0.7,
});

const store = new InMemoryStore({
    index: {
        embed: (texts) => texts.map(() => Array(5).fill(1)),
        dims: 5,
    },
});

const namespace = ['Durvankur', 'Agentic AI'];

await store.put(
    namespace, "User Profile", {
    name: "Durvankur",
    interests: ["Artificial Intelligence", "Machine Learning", "Natural Language Processing"],
    preferences: "short and clear explanations",
}
);

const userInput = "What is my name and what am i learning about?";

const memories = await store.search(namespace,{
    query: "user Information",
})

const memoryContext = memories.map((m) => JSON.stringify(m.value)).join('\n');

const prompt = `
You are a helpful AI assistant.

known user information:
${memoryContext}
User:${userInput}

AI:`;


const res = await model.invoke(prompt);

console.log(res.content);
