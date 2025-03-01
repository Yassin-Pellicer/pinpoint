
export class Tag {
  constructor(public name: string) {}

  static readonly tags = [
    new Tag("buy"),
    new Tag("sell"),
    new Tag("hunts"),
    new Tag("ads"),
    new Tag("requests"),
    new Tag("routes"),
    new Tag("travel"),
    new Tag("secrets"),
    new Tag("art"),
    new Tag("solo"),
    new Tag("friends"),
    new Tag("family"),
    new Tag("education"),
    new Tag("food"),
    new Tag("nature"),
    new Tag("hiking"),
    new Tag("music"),
    new Tag("sport"),
    new Tag("movies"),
    new Tag("books"),
    new Tag("literature"),
    new Tag("games"),
    new Tag("politics"),
    new Tag("health"),
    new Tag("science"),
    new Tag("fashion"),
  ];

  static readonly optionTags = [
    new Tag("qr"),
    new Tag("tour"),
    new Tag("public"),
    new Tag("private"),
  ]

  static readonly allTags = [...Tag.tags, ...Tag.optionTags];
}

