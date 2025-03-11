import { Checkpoint } from "./cpClass";
import { Tag } from "./Tag";
import { Event as EventClass } from "./EventClass";

export class Event extends EventClass {
  constructor(
    public name: string,
    public description: string,
    public marker: any,
    public banner: string,
    public tags: Tag[],
    public qr: boolean,
    public isPublic: boolean,
    public checkpoints: Checkpoint[] = [] // Only checkpoints remain optional
  ) {
    super(); // Ensure the parent class is initialized properly
  }
}
