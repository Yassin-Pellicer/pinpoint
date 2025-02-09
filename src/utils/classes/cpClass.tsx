export class Checkpoint {
  id: number;
  description: string;
  order: number;
  name: string;
  marker: any;

  constructor(
    marker: any,
    id: any,
    description: string,
    order: number,
    name: string
  ) {
    this.id = id;
    this.description = description;
    this.order = order;
    this.name = name;
    this.marker = marker;
  }
}
