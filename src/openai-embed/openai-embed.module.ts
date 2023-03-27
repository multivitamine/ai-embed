import { Module } from '@nestjs/common';
import { OpenaiEmbedService } from './openai-embed.service';
import { OpenaiEmbedController } from './openai-embed.controller';

@Module({
  controllers: [OpenaiEmbedController],
  providers: [OpenaiEmbedService],
})
export class OpenaiEmbedModule {}
