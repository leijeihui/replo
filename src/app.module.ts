import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './schemas'
import { TripService, TripRepositoryService } from './services';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
  ],
  controllers: [AppController],
  providers: [TripService, TripRepositoryService],
})
export class AppModule {}
