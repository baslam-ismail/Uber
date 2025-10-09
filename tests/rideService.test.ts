// tests/rideService.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { Rider } from "../src/models/Rider";
import { Driver } from "../src/models/Driver";
import { RideService } from "../src/rideService";
import { Ride } from "../src/models/Ride";

/**
 * Helpers
 */
function makeRider(
  id = "r1",
  name = "Alice",
  balance = 100,
  birthday = new Date(1990, 9, 9)
) {
  return new Rider(id, name, balance, birthday);
}

function makeDriver(id = "d1", name = "Fischer", isUberX = false) {
  return new Driver(id, name, isUberX);
}

describe("RideService - TDD tests (cas par cas)", () => {
  let service: RideService;
  let rider: Rider;
  let driver: Driver;

  beforeEach(() => {
    service = new RideService();
    rider = makeRider();
    driver = makeDriver();
  });

  //créer les modèles
  it("Créer un Rider", () => {
    expect(rider).toBeInstanceOf(Rider);
    expect(rider.balance).toBe(100);
    expect(rider.loyaltyPoints).toBe(0);
  });

  it("Créer un Driver", () => {
    expect(driver).toBeInstanceOf(Driver);
    expect(driver.isUberX).toBe(false);
  });

  it("Créer une Course (Ride) via bookRide", () => {
    const ride = service.bookRide(rider, driver, "Paris", "Paris", 5);
    expect(ride).toBeInstanceOf(Ride);
    expect(ride.origin).toBe("Paris");
    expect(rider.rides.length).toBe(1);
  });

  // === Étape 1 — Réservation simple (Story 1) ===
  it("Réserver une course avec fonds suffisants", () => {
    const before = rider.balance;
    const ride = service.bookRide(rider, driver, "Paris", "Lyon", 10);
    expect(ride).not.toBeNull();
    expect(rider.balance).toBeLessThan(before);
  });

  it("Refuser la réservation si fonds insuffisants", () => {
    const poor = makeRider("r2", "Poor", 1);
    expect(() => service.bookRide(poor, driver, "Paris", "Lyon", 10)).toThrow();
    expect(poor.rides.length).toBe(0);
  });

  it("Refuser une nouvelle réservation si une autre est déjà en attente", () => {
    const r = makeRider();
    service.bookRide(r, driver, "Paris", "Lyon", 5);
    expect(() => service.bookRide(r, driver, "Paris", "Nice", 5)).toThrow();
  });

  it("Annuler la course précédente avant de créer une nouvelle", () => {
    const r = makeRider();
    const ride1 = service.bookRide(r, driver, "Paris", "Lyon", 5);
    // annuler
    const cancelled = service.cancelRide(r, ride1.id);
    expect(cancelled).toBe(true);
    // now we can book another
    const ride2 = service.bookRide(r, driver, "Paris", "Nice", 5);
    expect(ride2).toBeTruthy();
  });

  it("Calcul du prix de base selon origine/destination", () => {
    const stdDriver = makeDriver("d2", "D2", false);
    // paris paris
    const r1 = makeRider();
    const ride1 = service.bookRide(r1, stdDriver, "Paris", "Paris", 0);
    expect(ride1.price).toBe(2); // base 2 + km(0) no uberX
    // banlieu paris
    const r2 = makeRider("r3");
    const ride2 = service.bookRide(r2, stdDriver, "Lille", "Paris", 0);
    expect(ride2.price).toBe(0);
    //paris banlieu
    const r3 = makeRider("r4");
    const ride3 = service.bookRide(r3, stdDriver, "Paris", "Lille", 0);
    expect(ride3.price).toBe(10);
  });

  //annuler
  it("Annuler une course en attente (pas de pénalité) -> remboursement intégral", () => {
    const r = makeRider();
    const d = new Driver("", "marc", false);
    const initialBalance: number = r.balance;

    const ride = service.bookRide(r, d, "Paris", "Lyon", 5);

    const cancelled = service.cancelRide(r, ride.id);

    expect(cancelled).toBe(true);
    expect(r.balance).toBeGreaterThanOrEqual(100);
  });

  it("Annuler une course alors que le Driver est déjà en chemin -> pénalité 5€", () => {
    const r = makeRider();
    const d = makeDriver();
    const initialBalance: number = r.balance;
    const ride = service.bookRide(r, d, "Paris", "Lyon", 5);

    r.credit(initialBalance - r.balance);
    const cancelled = service.cancelRide(r, ride.id);

    expect(cancelled).toBe(true);
    expect(r.balance).toBe(95);
  });

  it("Impossible d’annuler deux fois (deuxième annulation rejetée)", () => {
    const r = makeRider();
    const ride = service.bookRide(r, driver, "Paris", "Lyon", 5);
    const first = service.cancelRide(r, ride.id);
    expect(first).toBe(true);
    expect(() => service.cancelRide(r, ride.id)).toThrow();
  });

  it("Annulation gratuite le jour de l’anniversaire du Rider (même si driver en chemin)", () => {
    const birthday = new Date(1990, 9, 9);
    const r = makeRider("rb", "B", 100, birthday);
    const d = makeDriver();
    const ride = service.bookRide(r, d, "Paris", "Lyon", 5, birthday);
    ride.driverId = d.id;
    const balBefore = r.balance;
    const cancelled = service.cancelRide(r, ride.id, birthday);
    expect(cancelled).toBe(true);
    expect(r.balance).toBeGreaterThanOrEqual(balBefore);
  });

  //historique
  it("Afficher la liste vide si aucune course", () => {
    const r = makeRider("empty");
    const hist = service.listRides(r);
    expect(Array.isArray(hist)).toBe(true);
    expect(hist.length).toBe(0);
  });

  it("Associer le bon Driver à chaque course", () => {
    const r = makeRider("hx");
    const d1 = new Driver("dA", "A", false);
    const d2 = new Driver("dB", "B", false);
    const ride1 = service.bookRide(r, d1, "Paris", "Lille", 10);

    ride1.complete();

    const ride2 = service.bookRide(r, d2, "Paris", "Marseille", 20);
    ride2.complete();

    expect(ride1.driverId).toBe(d1.id);
    expect(ride2.driverId).toBe(d2.id);
  });

  // point de fidelité
  it("Ajouter 1 point de fidélité après une course terminée", () => {
    const r = makeRider("lp1");
    const d = makeDriver();
    const ride = service.bookRide(r, d, "Paris", "Lyon", 5);
    service.completeRide(r, ride.id);
    expect(r.loyaltyPoints).toBeGreaterThanOrEqual(1);
  });

  it("Points cumulés correctement sur plusieurs courses", () => {
    const r = makeRider("lp2");
    const d = makeDriver();
    const ride1 = service.bookRide(r, d, "Paris", "Lyon", 5);
    service.completeRide(r, ride1.id);
    const ride2 = service.bookRide(r, d, "Paris", "Nice", 5);
    service.completeRide(r, ride2.id);
    expect(r.loyaltyPoints).toBeGreaterThanOrEqual(2);
  });

  // noel et uberx
  it("Prix doublé si la course est le jour de Noël (25/12)", () => {
    const r = makeRider("xmasr");
    const d = makeDriver();
    const christmas = new Date(2025, 11, 25);
    const ride = service.bookRide(r, d, "Paris", "Lyon", 10, christmas);
    expect(ride.price).toBe(30);
  });

  it("Pas de doublement en dehors du 25 décembre", () => {
    const r = makeRider("nonx");
    const d = makeDriver();
    const normal = new Date(2025, 11, 24);
    const ride = service.bookRide(r, d, "Paris", "Lyon", 10, normal);
    expect(ride.price).toBe(15); // 10 + 5
  });

  it("Ajouter +5 € si le service = UberX", () => {
    const r = makeRider("ux1");
    const uber = makeDriver("dux", "Uber", true);
    const ride = service.bookRide(r, uber, "Paris", "Paris", 0);
    // base Paris->Paris = 2 + 0 + 5 uberX = 7
    expect(ride.price).toBe(7);
  });

  it("Pas de supplément si service standard", () => {
    const r = makeRider("st1");
    const std = makeDriver("dstd", "Std", false);
    const ride = service.bookRide(r, std, "Paris", "Paris", 0);
    expect(ride.price).toBe(2);
  });

  it("UberX offert le jour de l'anniversaire du Rider (supplément non appliqué)", () => {
    const bday = new Date(1990, 9, 9);
    const r = makeRider("bd", "Birthday", 200, bday);
    const uber = makeDriver("dux2", "Uber2", true);
    const ride = service.bookRide(r, uber, "Paris", "Lille", 0, bday);
    expect(ride.price).toBe(10);
  });

  //Scénarios combinés (intégration)
  it("Réserver un UberX le jour de Noël → double du prix + 5 € (ordre: +5 then *2)", () => {
    const r = makeRider("comb1");
    const uber = makeDriver("dux3", "Uber3", true);
    const christmas = new Date(2025, 11, 25);
    const ride = service.bookRide(r, uber, "Paris", "Lyon", 10, christmas);

    expect(ride.price).toBe(40);
  });

  it("Réserver un UberX le jour d'anniversaire du Rider pas +5 €", () => {
    const bday = new Date(1990, 9, 9);
    const r = makeRider("comb2", "Comb2", 500, bday);
    const uber = makeDriver("dux4", "Uber4", true);
    const ride = service.bookRide(r, uber, "Paris", "Lyon", 10, bday);
    expect(ride.price).toBe(15);
  });

  it("Rider sans fonds suffisants pour un trajet + UberX → échec réservation", () => {
    const r = makeRider("poor2", "Poor2", 1);
    const uber = makeDriver("dux5", "Uber5", true);
    expect(() => service.bookRide(r, uber, "Paris", "Lille", 10)).toThrow();
  });

  it("Annuler une course UberX le jour de Noël → vérifier pénalité correcte", () => {
    const r = makeRider("annx");
    const uber = makeDriver("dux6", "Uber6", true);
    const christmas = new Date(2025, 11, 25);
    const ride = service.bookRide(r, uber, "Paris", "Lyon", 5, christmas);
    ride.driverId = uber.id;
    const before = r.balance;
    const cancelled = service.cancelRide(r, ride.id, christmas);
    expect(cancelled).toBe(true);
    expect(r.balance).toBe(before - 5);
  });

  it("Terminer une course UberX → vérifier ajout du point de fidélité + prix correct", () => {
    const r = makeRider("fin1");
    const uber = makeDriver("dux7", "Uber7", true);
    const ride = service.bookRide(r, uber, "Paris", "Lyon", 10);
    const priceTaken = ride.price;
    service.completeRide(r, ride.id);
    expect(r.loyaltyPoints).toBeGreaterThanOrEqual(1);
    expect(priceTaken).toBe(ride.price);
  });
});
