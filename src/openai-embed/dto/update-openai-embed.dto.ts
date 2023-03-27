import { PartialType } from '@nestjs/mapped-types';
import { CreateOpenaiEmbedDto } from './create-openai-embed.dto';

export class UpdateOpenaiEmbedDto extends PartialType(CreateOpenaiEmbedDto) {}
