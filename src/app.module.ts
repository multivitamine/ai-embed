import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { OpenaiEmbedModule } from './openai-embed/openai-embed.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    OpenaiModule,
    ConfigModule.forRoot(),
    OpenaiEmbedModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'client/vite-project'),
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
