import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TripDto } from 'src/dtos';
import { Trip } from '../schemas';

@Injectable()
export class TripRepositoryService {
  constructor(@InjectModel(Trip.name) private readonly tripModel: Model<Trip>) {}

  async create(tripDto: TripDto): Promise<Trip> {
    return this.tripModel.create(tripDto);
  }

  async update(tripDto: TripDto): Promise<Trip> {
    return this.tripModel.findOneAndUpdate({ _id: tripDto._id }, tripDto);
  }

  async findAll(): Promise<Trip[]> {
    return this.tripModel.find().exec();
  }

  async findOne(tripId: string): Promise<Trip> {
    return this.tripModel.findOne({ tripId }).exec();
  }


  async delete(tripId: string): Promise<Trip> {
    return this.tripModel
      .findOneAndDelete({ tripId }, )
      .exec();
  }
}