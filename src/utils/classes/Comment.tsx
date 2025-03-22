export class Comment {
  content: string;
  author: number;
  date: Date;
  assignRating: boolean;

  constructor(content: string, author: number, date: Date, assignRating: boolean) {
    this.content = content;
    this.author = author;
    this.date = date;
    this.assignRating = assignRating;
  }
}
