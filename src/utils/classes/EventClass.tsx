import { Tag } from "./Tag";
import { Comment } from "./Comment";

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
    public author: string = "",
    public comments: Comment[] = [],
    public rating: number = null
  ) {}
}
