import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiEmbedController } from './openai-embed.controller';
import { OpenaiEmbedService } from './openai-embed.service';

describe('OpenaiEmbedController', () => {
  let controller: OpenaiEmbedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenaiEmbedController],
      providers: [OpenaiEmbedService],
    }).compile();

    controller = module.get<OpenaiEmbedController>(OpenaiEmbedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
