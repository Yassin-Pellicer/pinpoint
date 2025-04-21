import { Tag } from "./Tag";
import { Comment } from "./Comment";
import { Checkpoint } from "./Checkpoint";

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
    public address: string = "",
    public checkpoints: Checkpoint[] = [],
    public enableInscription: boolean = false,
    public capacity: number = null,
    public inscriptions: number = null,
    public start: Date = null,
    public end: Date = null,
  ) {}
}
