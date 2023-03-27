import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiEmbedService } from './openai-embed.service';

describe('OpenaiEmbedService', () => {
  let service: OpenaiEmbedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenaiEmbedService],
    }).compile();

    service = module.get<OpenaiEmbedService>(OpenaiEmbedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
