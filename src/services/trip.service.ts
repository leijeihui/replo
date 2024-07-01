import { Injectable } from '@nestjs/common';
import { TripDto } from 'src/dtos';
import { Trip } from '../schemas';
import { getDistance } from 'geolib'
import { TripRepositoryService } from './trip.repository.service';
import { DateTime } from 'luxon'
import { v4 as uuidv4 }from 'uuid'

const SpaceFleet = {
    'SS-001': {
        id: 'SS-001',
        name: 'Galactic Voyager',
        location: 'JFK',
        available_at: null
    },
    'SS-002': {
        id: 'SS-002',
        name: 'Star Hopper',
        location: 'JFK',
        available_at: null
    },
    'SS-003': {
        id: 'SS-003',
        name: 'Cosmic Cruiser',
        location: 'SFO',
        available_at: null
    },
}

const Locations = {
    JFK: {
        lat: 40.6413,
        long: -73.7781,
        location: 'JFK'
    },
    SFO: {
        lat: 37.6213,
        long: -122.3790,
        location: 'SFO'
    },
    LAX: {
        lat: 33.9416,
        long: -118.4085,
        location: 'LAX'
    }
}

@Injectable()
export class TripService {
  constructor(
    private readonly tripRepositoryService: TripRepositoryService
  ) {}

  async create(departureLocationCode: string, destinationLocationCode: string): Promise<Trip | { nextAvailability: string }> {
    // find available space ships & is not in flight already
    const availableSpaceships = Object.values(SpaceFleet).filter(ship => ship.location === departureLocationCode && !ship.available_at || DateTime.now() > DateTime.fromISO(ship.available_at))

    if (!availableSpaceships.length) {
        const nextAvailableSpaceships = Object.values(SpaceFleet).map(ship => {
            let timeToAvailable = ship.available_at ? DateTime.fromISO(ship.available_at).toSeconds() : DateTime.now() / 1000
            const shipLocation = Locations[ship.location]
            const departureLocation = Locations[departureLocationCode]
            const durationInSeconds = Math.floor(getDistance(
                { latitude: shipLocation.lat, longitude: shipLocation.long },
                { latitude: departureLocation.lat, longitude: departureLocation.long },
            )  / 447)



            return  {
                ...ship,
                timeToAvailable: DateTime.now().plus({ seconds: timeToAvailable + durationInSeconds})
            }
        }).sort((a, b) => DateTime.fromISO(a.timeToAvailable) - DateTime.fromISO(b.timeToAvailable))

        return { 
            nextAvailability:  nextAvailableSpaceships[0].timeToAvailable
        }
    }

    const departureLocation = Locations[departureLocationCode]
    const destinationLocation = Locations[destinationLocationCode]

    // lib returns distance in meters. 1000MPH is 447 meters/s
    const durationInSeconds = Math.floor(getDistance(
        { latitude: departureLocation.lat, longitude: departureLocation.long },
        { latitude: destinationLocation.lat, longitude: destinationLocation.long },
    )  / 447)

    const currentTime = DateTime.now()
    const arrivalTime = currentTime.plus({ seconds: durationInSeconds })

    const trip = await this.tripRepositoryService.create({
        departureLocationCode,
        destinationLocationCode,
        departureAt: currentTime.toISO(),
        arrivalAt: arrivalTime,
        spaceshipId: availableSpaceships[0].id,
        tripId: uuidv4(),
        _id: uuidv4(),
        created_at: currentTime.toISO(),
        updated_at: currentTime.toISO()
    })
    
    SpaceFleet[trip.spaceshipId].available_at = trip.arrivalAt
    SpaceFleet[trip.spaceshipId].location = destinationLocationCode

    return trip
  }

  async get(tripId: string): Promise<Trip> {
    return this.tripRepositoryService.findOne(tripId)
  }

  async delete(tripId: string): Promise<Trip> {
    return this.tripRepositoryService.delete(tripId)
  }

}