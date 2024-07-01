import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TripDocument = HydratedDocument<Trip>;

@Schema()
export class Trip {
  @Prop()
  _id: string;
  
  @Prop()
  created_at: string;

  @Prop({ required: false })
  updated_at?: string;

  @Prop()
  departureLocationCode: string;


  @Prop()
  destinationLocationCode: string;

  @Prop()
  departureAt: string

  @Prop()
  arrivalAt: string

  @Prop()
  spaceshipId: string

  @Prop()
  tripId: string
}

export const TripSchema = SchemaFactory.createForClass(Trip);
