import { useTranslations } from "next-intl";

const t = useTranslations("Tags");

export class Tag {

  constructor (public name: string) {}

  static readonly buy = new Tag("buy");
  static readonly sell = new Tag("sell");
  static readonly hunts = new Tag("hunts");
  static readonly ads = new Tag("ads");
  static readonly requests = new Tag("requests");
  static readonly routes = new Tag("routes");
  static readonly travel = new Tag("travel");
  static readonly secrets = new Tag("secrets");
  static readonly art = new Tag("art");
  static readonly solo = new Tag("solo");
  static readonly friends = new Tag("friends");
  static readonly family = new Tag("family");
  static readonly education = new Tag("education");
  static readonly food = new Tag("food");
  static readonly nature = new Tag("nature");
  static readonly hiking = new Tag("hiking");
  static readonly music = new Tag("music");
  static readonly sport = new Tag("sport");
  static readonly movies = new Tag("movies");
  static readonly books = new Tag("books");
  static readonly literature = new Tag("literature");
  static readonly games = new Tag("games");
  static readonly politics = new Tag("politics");
  static readonly health = new Tag("health");
  static readonly science = new Tag("science");
  static readonly fashion = new Tag("fashion");
  static readonly qr = new Tag("qr");
  static readonly tour = new Tag("tour");
  static readonly public = new Tag("public");
  static readonly private = new Tag("private");
}

