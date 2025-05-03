import { Event } from "./Event";
import { Comment } from "./Comment";
import { Rating } from "./Rating";

export class User {
  constructor(
    public id: number = null,
    public username: string = "",
    public profilePicture: string = "",
    public banner: string = "",
    public email: string = "",
    public description: string = "",
    public followers: number = null,
    public following: number = null,
    public createdEvents: Event[] = [],
    public bookmarks: Event[] = [],
    public inscriptions: Event[] = [],
    public comments: Comment[] = [],
    public ratings: Rating[] = [],
    public link: string = "",
    public memberSince: Date = null
  ) {}
}
