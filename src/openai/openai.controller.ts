import { Body, Controller, Get } from '@nestjs/common';
import { GetAnswerDto } from './dto/get-answer-dto';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get('question')
  //getModelAnswer(@Body() data: GetAnswerDto) {
  getModelAnswer() {
    return this.openaiService.getModelAnswer();
  }
  @Get('embed')
  getEmbedVectors() {
    return this.openaiService.getEmbedVectors();
  }
  @Get('testCosine')
  getTestCosineSimularity() {
    return this.openaiService.getTestCosineSimularity();
  }
  @Get('compare')
  getOpenaiVectorAndCompare() {
    return this.openaiService.getOpenaiVectorAndCompare();
  }
  @Get('test')
  checkProductApi() {
    return this.openaiService.findAll();
  }
  
}
