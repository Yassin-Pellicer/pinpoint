import { Tag } from "./Tag";

export class Event {
  constructor(
    public id: number = null,
    public name: string = "",
    public description: string = "",
    public marker: any = null,
    public banner: string = "",
    public tags: Tag[] = [],
    public qr: boolean = false,
    public isPublic: boolean = false,
    public author: string = ""
  ) {}
}
