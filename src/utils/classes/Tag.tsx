
export class Tag {
  constructor(public name: string, public id?: number) {}

  static readonly tags = [
    new Tag("buy", 1),
    new Tag("sell", 2),
    new Tag("hunts", 3),
    new Tag("ads", 4),
    new Tag("requests", 5),
    new Tag("routes", 6), ,
    new Tag("travel", 7),
    new Tag("secrets", 8),
    new Tag("art", 9),
    new Tag("solo", 10),
    new Tag("friends", 11),
    new Tag("family", 12),
    new Tag("education", 13),
    new Tag("food", 14),
    new Tag("nature", 15),
    new Tag("hiking", 16),
    new Tag("music", 17),
    new Tag("sport", 18),
    new Tag("movies", 19),
    new Tag("books", 20),
    new Tag("literature", 21),
    new Tag("games", 22),
    new Tag("politics", 23),
    new Tag("health", 24),
    new Tag("science", 25),
    new Tag("fashion", 26),
  ];

  static readonly optionTags = [
    new Tag("qr"),
    new Tag("tour"),
    new Tag("public"),
    new Tag("private"),
  ]

  static readonly allTags = [...Tag.tags, ...Tag.optionTags];
}

