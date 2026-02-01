import { tool } from "@langchain/core/tools";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview",    
    temperature: 0.7
})


const calculator = tool(
    async ({ a, b, operation }) => {
        switch (operation) {
            case "add":
                return a + b;
                break;
            case "subtract":
                return a - b;
                break;
            case "multiply":
                return a * b;
                break;
            case "divide":
                return a / b;
                break
            default: throw new Error("Unsupported operation");
        }
    },
    {
        name: "calculator",
        description: "It is  a simple calculatoe that peroform the basic atirthmatic operations ",
        schema:{
            type: "object",
            properties: {
                a: { type: 'number'},
                b: { type: 'number'},
                operation: { type: 'string', enum: ['add', 'subtract', 'multiply', 'divide']
                }
                },
                required: ['a', 'b', 'operation']
        },
    },
);

const modelwithtools = model.bind({
    tools:[calculator],
})

const res = await modelwithtools.invoke(
  "what is the sum of 12 and 15 using calculator tool?"
)

console.log(res);