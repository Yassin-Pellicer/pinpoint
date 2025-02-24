import { Checkpoint } from "./cpClass";
import { Tag } from "./Tag"

export class Event {
  constructor(
    public name: string,
    public description: string,
    public checkpoints: Checkpoint[],
    public location: number[],
    public banner: Blob,
    public tags: Tag[]
  ) {}
}
