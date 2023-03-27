import { Injectable } from '@nestjs/common';
import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';

// const DEFAULT_MODEL_ID = 'text-babbage-001';
// const DEFAULT_TEMP = 0.9;

@Injectable()
export class OpenaiEmbedService {
  private readonly openAIApi: OpenAIApi;
  constructor() {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openAIApi = new OpenAIApi(configuration);
  }

  async getEmbedVectors() {
    try {
      const response = await this.openAIApi.createEmbedding({
        model: 'text-embedding-ada-002',
        input: 'The food was delicious and the waiter...',
      });

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
