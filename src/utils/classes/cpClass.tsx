export class Checkpoint {
  id: number;
  banner: string;
  description: string;
  order: number;
  name: string;
  marker: any;
  img: any;

  constructor(
    marker: any,
    id: any,
    banner: string,
    description: string,
    order: number,
    name: string,
    img: any
  ) {
    this.id = id;
    this.banner = banner;
    this.description = description;
    this.order = order;
    this.name = name;
    this.marker = marker;
    this.img = img;
  }
}
