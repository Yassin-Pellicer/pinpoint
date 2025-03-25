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
    public isPublic: boolean = true,
    public author: string = "",
    public comments: Comment[] = [],
    public rating: number = null,
    public enableRatings: boolean = false,
    public enableComments: boolean = false,
  ) {}
}
