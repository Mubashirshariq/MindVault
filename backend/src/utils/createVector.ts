
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const HF_TOKEN = process.env.HUGGING_FACE_TOKEN;
if (!HF_TOKEN) {
  throw new Error('HUGGING_FACE_TOKEN is not defined in environment variables');
}

const inference = new HfInference(HF_TOKEN);

export async function createEmbedding(input:string){
    try {
        const vector = await inference.featureExtraction({
            model: 'sentence-transformers/distilbert-base-nli-mean-tokens',
            inputs: `${input}`,
          });
          return vector;
    } catch (error) {
        console.log("error while creating vector embedding");
    }
 
}