
import express from "express"
import { User,Content,Link } from "../models/schema";
import bcrypt  from "bcrypt"
import { z } from "zod";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv"
import {authMiddleware} from "../middlewares/authMiddleware";
import { generateShareLink } from "../utils/generateRandomLink";
import {GoogleGenerativeAI} from "@google/generative-ai"
import { createVector } from "../utils/vector";
import { createEmbedding } from "../utils/createVector";
import { Pinecone, type PineconeConfiguration } from '@pinecone-database/pinecone';

dotenv.config();


const URL:string="/api/v1"
const JwtSecret:string=process.env.JWT_SECRET as string;
const gemini_api_key:string=process.env.GEMINI_API_KEY as string;

const config: PineconeConfiguration = {
   apiKey: process.env.PINECONE_API_KEY || '',
 };
 if (!config.apiKey) {
   throw new Error('PINECONE_API_KEY is not defined in environment variables');
 }
 
const pc = new Pinecone(config);
const pcIndex = pc.index('brainly');

async function AiPipeline(input: string) {
   const queryEmbedding = await createEmbedding(input);
   const queryResponse = await pcIndex.namespace("ns1").query({
     //@ts-ignore
     vector: queryEmbedding,
     topK: 5,
     includeValues: true,
     includeMetadata: true,
   });
 
   const contexts = queryResponse.matches.map((match) => match?.metadata?.description);
   console.log("contexts: ", contexts);
   const contextString = contexts.join("\n");

   const genericQueries = [
     "hi",
     "hello",
     "who is the pm of india",
   ];
 
   if (genericQueries.includes(input.toLowerCase())) {
     return handleGenericQuery(input);
   }

   if (!contextString || contexts.length === 0) {
     return "I'm sorry, I couldn't find relevant information for your query. Could you please clarify or provide more details?";
   }
 
   const genAI = new GoogleGenerativeAI(gemini_api_key);
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 
   const prompt = `
     You are an advanced AI assistant designed to act as a second brain for the user, capable of processing and synthesizing complex information from various saved resources like YouTube links, Twitter posts, articles, and other references. Your task is to analyze the provided context and give precise, insightful, and actionable responses to the user's query.
 
     Context:
     ${contextString}
 
     User Query:
     ${input}
 
     Instructions:
     - If the user asks a generic or irrelevant question (e.g., "Hi", "Who is the PM of India"), respond with a simple, appropriate answer without trying to analyze the context.
     - Otherwise, deeply understand the context, draw connections across different data points, and provide clear, concise answers.
     - Where relevant, include references to specific sources or key details from the context.
     - If the query requires synthesis or analysis, provide a thoughtful, well-reasoned response.
 
     Answer:
   `;
 
   try {
     //@ts-ignore
     const result = await model.generateContent(prompt);
     return result.response.text();
   } catch (error) {
     console.error("Error in AiPipeline:", error);
     throw new Error("AI Pipeline failed");
   }
 }
 
 function handleGenericQuery(input: string) {
   const genericResponses: { [key: string]: string } = {
     hi: "Hello! How can I assist you today?",
     hello: "Hi there! What can I help you with?",
   };
 
   const lowerCaseInput = input.toLowerCase();
   if (genericResponses[lowerCaseInput]) {
     return genericResponses[lowerCaseInput];
   }
 
   return "I'm here to assist you! Please provide more details or ask a specific question.";
 }
 
export const router=express.Router();


// router.use(express.json());
//signup route
router.post(`${URL}/signup`,async (req,res)=>{
   const {username,password}=req.body;
   try {
      const schema=z.object({
         username:z.string().min(5,{message: "Must be 5 or more characters long"}),
         password:z.string().min(4,{message: "Must be 6 or more characters long"} ).max(20,{message: "Must be 20 or fewer characters long" })
   
      })
      const parsedData=schema.safeParse({username,password})
      if(!parsedData.success){
          res.status(401).json({
           message: "Invalid data",
           errors: parsedData.error.errors
         });
         return;
     }
      const hashedPassword=await bcrypt.hash(password,10);
      await User.create({
         username,
         password:hashedPassword
      })

      res.json({
         message:"User Signup successfull"
      })
   } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
          message: "User signup unsuccessful",
          error: error as any
      });
   }
   
})

//signin route
router.post(`${URL}/signin`,async (req,res)=>{
   const { username, password } = req.body;
   try {
      const schema=z.object({
         username:z.string().min(5,{message: "Must be 5 or more characters long"}),
         password:z.string().min(4,{message: "Must be 6 or more characters long"} ).max(20,{message: "Must be 20 or fewer characters long" })
   
      })
      const parsedData=schema.safeParse({username,password})
      if(!parsedData.success){
          res.status(401).json({
           message: "Invalid data",
           errors: parsedData.error.errors
         });
         return;
      }
      const user = await User.findOne({ username });
      if (!user) {
          res.status(403).json({
            message: 'Login unsuccessful. User not found.',
         });
         return;
      }
      const isPasswordValid = await bcrypt.compare(password, user?.password || '');
      if (!isPasswordValid) {
          res.status(403).json({
            message: 'Login unsuccessful. Incorrect password.',
         });
         return;
      }
      const token = jwt.sign({ id:  user?._id || '' }, JwtSecret );
      res.json({
         message: 'Login successful',
         token,
      });
   } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({
         message: 'An error occurred during login. Please try again later.',
      });
   }
});

//posting content
router.post(`${URL}/content`,authMiddleware, async (req,res)=>{
    const {link,type,title,userId,description}=req.body;
    try {
      const content=await Content.create({
         link,
         type,
         title,
         description,
         tags:[],
         userId
      })
      createVector(req,res);

    } catch (error) {
      res.json({
         message:"error while posting content ",error
      })
    }
})

//query using ai
router.post(`${URL}/queryai`,async (req,res)=>{
   const {inputMessage}=req.body;
   try {
      const data=await AiPipeline(inputMessage);
      res.json({
         message:"queried ai model successfully",
         data
      })
   } catch (error) {
      res.status(404).json({
         message:"error while quering ai model",error
      })
   }
})

//get content
router.get(`${URL}/content`,authMiddleware,async(req,res)=>{
   const userId=req.body.userId;
   try {
      const content=await Content.find({
         userId
      }).populate("userId", "username")
      res.json({
          content
      })
   } catch (error) {
      res.status(404).json({
         message:"error while fetching content"
      })
   }
  
})

//delete content
router.delete(`${URL}/content`,authMiddleware,async (req,res)=>{
    const content_id=req.body.content_id;
   
    console.log(req.body)
    try {
      await Content.deleteMany({
         _id:content_id,
         userId: req.body.userId
     })
      const ns = pcIndex.namespace('ns1');
      await ns.deleteOne("dd6e5c6a-6819-45e7-b0f5-0464e29b4a03");
     res.json({
         message: "deleted content"
     })
    } catch (error) {
      res.status(404).json({
         error
      })
    }
})

router.post(`${URL}/brain/share`,authMiddleware, async(req, res) => {
   const { share } = req.body;
   if (!share) {
        res.status(400).json({ error: 'Data to share is required' });
   }
   const hash = generateShareLink(10);
   await Link.create({
      hash,
      userId:req.body.userId
   })
   res.status(201).json({
       message: 'Share link created successfully',
       hash
   });
});

router.get(`${URL}/brain/:shareLink`,async (req, res) => {
   const hash  = req.params.shareLink;
  
   const link=await Link.findOne({
      hash
   })
   if (!link) {
      res.status(400).json({ error: 'Share link is required' });
      return
 }
   const content=await Content.find({
      userId:link.userId
   })
   const user=await User.findOne({
      _id:link.userId
   })
 
   res.status(200).json({
       username:user?.username,
       content:content,
       message: 'Shared data retrieved successfully',
       
   });
});





