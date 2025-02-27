export class Checkpoint {
  id: number;
  banner: string;
  description: string;
  order: number;
  name: string;
  marker: any;

  constructor(
    marker: any,
    id: any,
    banner: string,
    description: string,
    order: number,
    name: string,
  ) {
    this.id = id;
    this.banner = banner;
    this.description = description;
    this.order = order;
    this.name = name;
    this.marker = marker;
  }
}
