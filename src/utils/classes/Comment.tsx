export class Comment {
  content: string;
  user: number;
  username: string;
  posted_at: Date;
  rating: number;
  id: number;
  profilePicture: string;
  isprivate: boolean;

  constructor(content: string, user: number, username: string, posted_at: Date, rating: number, isprivate: boolean) {
    this.content = content;
    this.user = user;
    this.username = username;
    this.posted_at = posted_at;
    this.rating = rating;
    this.isprivate = isprivate;
  }
}
