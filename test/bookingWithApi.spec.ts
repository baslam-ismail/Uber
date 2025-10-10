import { describe, it, expect, beforeEach } from 'vitest';
import { StubGoogleScanner } from './stub-googleScanner';
import { createBookingWithAPI, type Rider } from '@/services/booking.service';

describe('User Story 7 : Booking a ride using injected Google Maps stub', () => {
    let rider: Rider;
    let stubService: StubGoogleScanner;

    beforeEach(() => {
        rider = { id: 1, name: 'Alice', balance: 100 };
        stubService = new StubGoogleScanner({
            origin: 'Paris',
            destination: 'Boulogne-Billancourt',
            distanceKm: 10,
        });
    });

    it('should create a booking using the stubbed Google service', async () => {
        const booking = await createBookingWithAPI(
            rider,
            'Paris',
            'Boulogne-Billancourt',
            stubService
        );

        if (typeof booking !== 'string') {
            expect(booking.distanceKm).toBe(10);
            expect(booking.price).toBe(15);   // 5 + 10*1
            expect(rider.balance).toBe(85);   // 100 - 15
            expect(booking.riderId).toBeDefined();
        } else {
            throw new Error('Expected a Ride, got error code: ' + booking);
        }
    });
});
