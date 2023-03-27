import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';
import { HttpService } from '@nestjs/axios';
import axios from "axios"
import { catchError, firstValueFrom } from 'rxjs';

import * as similarity from 'compute-cosine-similarity';
import * as sqlite3 from 'sqlite3';

import * as fs from 'fs';

const DEFAULT_MODEL_ID = 'text-babbage-001';
const DEFAULT_TEMP = 0.9;

export const instance = axios.create({
  baseURL: '',
  headers: { Authorization: `Bearer AQAAANCMnd8BFdERjHoAwE_Cl-sBAAAAAk2LXnvzTESoEhbhReNk3QQAAAACAAAAAAAQZgAAAAEAACAAAADceN4tfdwMacgwqUn9cnZLqTPTkonaRneWgh9T489RtgAAAAAOgAAAAAIAACAAAACwgfBKzlKTa2IzLteb97I_3xt-gSGsN52M6q-gJIElwrABAAAG9xllxGnEdo2lbUA41CIGVcZSBN9cxALYU0Y7s0_8ejpB4sBYfgTixOAYkNThZqug6BQgUYCKHDFnHqqhqePhn1k4a_0TQvjT_GJyBr6DzIhleN2dAGd0SjyhjcwRCuJ2541W4GP1s8F6f65wCeGBr_GLsmjmZ5Kf34kUEzih0X7GxdtzGVmsHtMtGa_YeieewbdXDG7qY069pthBEqo8wuoGLvT0SYBrr699OFtCHxFW62w7qyiaDbxizVuVAbX85x3Y9fUXycDoF7mpQve18kTfeTVEzhoco5B3ybesg3mcdqTuX6Ke_rtsDIf9-8Dx21PbCQyB6UAE-RRK3NzYYaf06BPJLPTALAUkO8qZg2Oze1fNncNtGK00bOHRaxPi8eBDzOjh1eqThYsDjgkRhF6ZmamrcLsSn3PHm0aTjqFge_9Z_kkWit-UJyRybXhYVDkhNKiGJVuv2VRnWV2xqhcdgB7Mhhwc4XJMOGoHVoKUIrppcIB47IvwL3cr22c4NxplaATqyHxEVG8qbYpEhdP312gu9mhv7oQrcErwrMqFUMz_tgFRQ9M_ZB9XqchAAAAAXkemmp_t0yTBTiAGZ4W1cH0mySQtS1uDEDes2QAbVODSPbhQW6yfXugoEyCB2hEz6HgsxVZTZLMm6bNjCTdMiA` }
})

@Injectable()
export class OpenaiService {
  private readonly openAIApi: OpenAIApi;
  private readonly httpService: HttpService;

  constructor() {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openAIApi = new OpenAIApi(configuration);
  }

  async getModelAnswer() {
    try {
      const params: CreateCompletionRequest = {
        prompt: 'hallo test mijn prompts',
        model: DEFAULT_MODEL_ID,
        temperature: DEFAULT_TEMP,
      };
      const response = await this.openAIApi.createCompletion(params);

      const { data } = response;
      if (data.choices) {
        fs.writeFile(
          'transformedData.json',
          JSON.stringify(data.choices),
          (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          },
        );
        return data.choices;
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }
  // async getEmbedVectors() {
  //   try {
  //     const response = await this.openAIApi.createEmbedding({
  //       model: 'text-embedding-ada-002',
  //       input: 'metalen balken',
  //     });
  //     fs.writeFile(
  //       'transformedData.json',
  //       JSON.stringify(response.data),
  //       (err) => {
  //         if (err) throw err;
  //         console.log('The file has been saved!');
  //       },
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  async getEmbedVectors() {
    const db = new sqlite3.Database('./product.db');

    try {
      const response = await this.openAIApi.createEmbedding({
        model: 'text-embedding-ada-002',
        input: 'grijze stenen',
      });
      response.data.data[0].embedding;
      db.run(
        `INSERT INTO productVectors (name, vector) values ('grijze stenen', ${JSON.stringify(
          response.data.data[0].embedding.toString(),
        )})`,
      );
    } catch (error) {
      console.log(error);
    }
  }
  getTestCosineSimularity() {
    const db = new sqlite3.Database('./product.db');

    try {
      const x = [5, 23, 2, 5, 9],
        y = [3, 21, 2, 5, 14];

      const s = similarity(x, y);
      db.run(
        `INSERT INTO productVectors(name, vector) values ('metaal', ${s}) `,
      );
      return s;
    } catch (error) {
      console.log(error);
    }
  }
  async getOpenaiVectorAndCompare() {
    const db = new sqlite3.Database('./product.db');
    const response = await this.openAIApi.createEmbedding({
      model: 'text-embedding-ada-002',
      input: 'ik zoek leren producten',
    });
    const embedResponse = response.data.data[0].embedding;

  try {
    // execute SELECT statement
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM productVectors', [], (err, rows) => {
          if (err) {
            reject(err);
          }
          const overviewEmbeds = rows.map((row:any) => {
            // console.log(row, "__________________");
            // const backtoarray = row.vector.split(',')
            const similar = similarity(embedResponse ,JSON.parse(row.vector))
            return 'name : ' + row.name + ' similar : ' + similar;
          }); 
          resolve(overviewEmbeds);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      db.close();
    }
  }

  async getEmbeds(stringArray) {
    console.log('getEmbeds -------------------', )
    const db = new sqlite3.Database('./product.db');

    const response = await this.openAIApi.createEmbedding({
      model: 'text-embedding-ada-002',
      input: stringArray
    });

     response.data.data.forEach((element, index) => {
      console.log(stringArray[index])
      console.log(JSON.stringify(element.embedding).toString())
      db.run(
        `INSERT INTO productVectors(name, vector) values ('${stringArray[index]}', '${JSON.stringify(element.embedding)}') `,
      );
     });
   
  }
  
  async findAll() {
    console.log('findAll -------------------', )
    await instance.get('http://aiki-budo.pangaeacms.nl/api/v3/catalog/product?items=100')
      .then((response) => {
       const stringArray = response.data.data.items.map((item) => {
        console.log(item.name)
        return item.name
       })
       console.log(stringArray)
       this.getEmbeds(stringArray)

      
      });
  }
}