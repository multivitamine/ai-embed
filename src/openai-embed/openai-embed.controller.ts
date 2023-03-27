import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiEmbedService } from './openai-embed.service';
import { CreateOpenaiEmbedDto } from './dto/create-openai-embed.dto';

@Controller('openai-embed')
export class OpenaiEmbedController {
  constructor(private readonly openaiEmbedService: OpenaiEmbedService) {}

  @Post()
  create(@Body() createOpenaiEmbedDto: CreateOpenaiEmbedDto) {
    return this.openaiEmbedService.getEmbedVectors();
  }
}
