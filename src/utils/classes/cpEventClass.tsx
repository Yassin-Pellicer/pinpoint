import { Checkpoint } from "./cpClass";

export class cpEvent {
  constructor(
    public name: string,
    public checkpoints: Checkpoint[],
    public id: number,
    public description: string
  ) {}
}
