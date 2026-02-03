import dotenv from 'dotenv';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { InMemoryStore } from '@langchain/langgraph';
import { tool } from '@langchain/core/tools';

dotenv.config();

const store = new InMemoryStore();

const getUser = tool(
    async ({ userId }) => {
        const value = await store.get(["users"], userId)
        console.log("Fetched User:", value);
        return value;
    },
    {
        name: "get_user",
        description: "Fetch the user information from memory",
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string' }
            },
            required: ['userId']
        }
    }

)

const updateUser = tool(
    async ({ userId, name, age, email }) => {
        console.log("Updating the user information in memory")
        await store.put(["users"], userId, { name, age, email })
        return "Successfully updated user information";
    },
    {
        name: "update_user",
        description: 'Update the user information in memory',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                name: { type: 'string' },
                age: { type: 'number' },
                email: { type: 'string' }
            },
            required: ['userId', 'name', 'age', 'email']
        }
    }
)

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-3-flash-preview',
    temperature: 0.7,
})

async function Agent(message) {
  const runnable = model.bindTools([getUser, updateUser]);
  const response = await runnable.invoke(message);

  // If the model wants to call a tool
  if (response.tool_calls?.length) {
    for (const call of response.tool_calls) {
      if (call.name === "get_user") {
        const result = await getUser.invoke(call.args);
        return result;
      }

      if (call.name === "update_user") {
        const result = await updateUser.invoke(call.args);
        return result;
      }
    }
  }

  return response.content;
}

await Agent(
    "Save a user with ID user123, name Durvankur Joshi, age 19, email joshidurvankur@gmail.com"
)

console.log(await Agent("Get me the information of user with ID user123"));

