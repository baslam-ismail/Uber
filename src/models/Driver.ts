export class Driver {
  id: string;
  name: string;
  isUberX: boolean;

  constructor(id: string, name: string, isUberX: boolean = false) {
    this.id = id;
    this.name = name;
    this.isUberX = isUberX;
  }
}
