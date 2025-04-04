import { Checkpoint } from "./cpClass";
import { Tag } from "./Tag";
import { Event as EventClass } from "./EventClass";
import { Comment } from "./Comment";

export class Event extends EventClass {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public marker: any,
    public banner: string,
    public tags: Tag[],
    public qr: boolean,
    public isPublic: boolean,
    public author: string,
    public comments: Comment[],
    public rating: number,
    public enableRating: boolean = false,
    public enableComments: boolean = false,
    public checkpoints: Checkpoint[] = [],
    public address: string = "",
  ) {
    super(); 
  }
}
