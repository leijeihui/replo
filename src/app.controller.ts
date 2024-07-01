import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { Trip } from './schemas'
import { TripService } from './services/trip.service';



@Controller()
export class AppController {
  constructor(private readonly tripService: TripService) {}

  @Post('/api/v1/trips')
  async requestTrip(@Body() data: { departureLocationCode: string, destinationLocationCode: string } ): Promise<Trip | { nextAvailability: string }> {
    return this.tripService.create(data.departureLocationCode, data.destinationLocationCode)
  }

  @Delete('/api/v1/trips/:tripId')
  async deleteTrip(@Param('tripId') tripId: string): Promise<Trip> {
    return this.tripService.delete(tripId)
  }

  @Get('/api/v1/trips/:tripId')
  async getTrip(@Param('tripId') tripId: string): Promise<Trip> {
    return this.tripService.get(tripId)
  }
}
