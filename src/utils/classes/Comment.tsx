export class Comment {
  content: string;
  user: number;
  username: string;
  posted_at: Date;
  assignRating: boolean;
  rating: number;
  id: number;

  constructor(content: string, user: number, posted_at: Date, assignRating: boolean) {
    this.content = content;
    this.user = user;
    this.posted_at = posted_at;
    this.assignRating = assignRating;
  }
}
