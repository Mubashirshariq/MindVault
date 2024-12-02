import { v4 as uuidv4 } from 'uuid';
import { Pinecone, type PineconeConfiguration } from '@pinecone-database/pinecone';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const HF_TOKEN = process.env.HUGGING_FACE_TOKEN;
if (!HF_TOKEN) {
  throw new Error('HUGGING_FACE_TOKEN is not defined in environment variables');
}

const inference = new HfInference(HF_TOKEN);

const config: PineconeConfiguration = {
  apiKey: process.env.PINECONE_API_KEY || '',
};
if (!config.apiKey) {
  throw new Error('PINECONE_API_KEY is not defined in environment variables');
}

const pc = new Pinecone(config);
const pcIndex = pc.index('brainly');

export const createVector = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body as { title: string; description: string };
    
    if (!title || !description) {
      res.status(400).json({ message: 'Title and description are required' });
      return;
    }
    
    if (title.length < 3 || description.length < 3) {
      res.status(400).json({ message: 'Title and description must be at least 3 characters long' });
      return;
    }

    const vector = await inference.featureExtraction({
      model: 'sentence-transformers/distilbert-base-nli-mean-tokens',
      inputs: `${title} ${description}`,
    });

    if (!vector || !Array.isArray(vector) || vector.length === 0) {
      throw new Error('Vector extraction failed: Invalid response from Hugging Face');
    }

    console.log('Vector created:', vector);

    const PineconeRecord = {
      id: uuidv4(),
      values: vector,
      metadata: {
        title,
        description,
        createdAt: new Date().toISOString(),
      },
    };

    try {
      //@ts-ignore
      await pcIndex.namespace('ns1').upsert([PineconeRecord]);
      console.log('Record upserted to Pinecone');
      res.status(201).json({ message: 'Post created successfully', recordId: PineconeRecord.id });
    } catch (err: any) {
      throw new Error(`Pinecone upsert failed: ${err.message}`);
    }

  } catch (error) {
    console.error('Error in createVector:', error);
    res.status(500).json({
      message: 'Failed to create vector',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
