export class Checkpoint {
  id: number;
  event: number
  banner: string;
  description: string;
  order: number;
  name: string;
  marker: any;
  address: string;

  constructor(
    marker: any,
    id: any,
    banner: string,
    description: string,
    order: number,
    event: number,
    name: string,
  ) {
    this.id = id;
    this.banner = banner;
    this.description = description;
    this.order = order;
    this.name = name;
    this.event = event;
    this.marker = marker;
  }
}
