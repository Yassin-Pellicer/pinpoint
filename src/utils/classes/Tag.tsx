
export class Tag {
  constructor(public name: string, public tag_id?: number, public icon?: string) {}

  static readonly tags = [
    new Tag("buy", 1, "shopping_cart"),
    new Tag("sell", 2, "sell"),
    new Tag("hunts", 3, "search"),
    new Tag("ads", 4, "campaign"),
    new Tag("requests", 5, "assignment"),
    new Tag("routes", 6, "map"),
    new Tag("travel", 7, "flight"),
    new Tag("secrets", 8, "lock"),
    new Tag("art", 9, "palette"),
    new Tag("solo", 10, "person"),
    new Tag("friends", 11, "group"),
    new Tag("family", 12, "family_restroom"),
    new Tag("education", 13, "school"),
    new Tag("food", 14, "restaurant"),
    new Tag("nature", 15, "park"),
    new Tag("hiking", 16, "hiking"),
    new Tag("music", 17, "music_note"),
    new Tag("sport", 18, "sports_soccer"),
    new Tag("movies", 19, "movie"),
    new Tag("books", 20, "menu_book"),
    new Tag("literature", 21, "library_books"),
    new Tag("games", 22, "sports_esports"),
    new Tag("politics", 23, "gavel"),
    new Tag("health", 24, "health_and_safety"),
    new Tag("science", 25, "science"),
    new Tag("fashion", 26, "checkroom"),
  ];
  

  static readonly optionTags = [
    new Tag("qr"),
    new Tag("tour"),
    new Tag("public"),
    new Tag("private"),
  ]

  static readonly allTags = [...Tag.tags, ...Tag.optionTags];
}

