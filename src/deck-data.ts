export type PhotoCredit = {
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
};

export type SlideId = "intro" | "roof" | "attic" | "puja" | "kitchen" | "doorway" | "garden" | "finale";

export type SlideSpec = {
  id: SlideId;
  image: string;
  alt: string;
  credit: PhotoCredit;
  kind: "cover" | "chapter" | "finale";
  align: "left" | "right";
  chapter?: "roof" | "attic" | "puja" | "kitchen" | "doorway" | "garden";
};

const commons = (file: string): string =>
  `https://commons.wikimedia.org/wiki/${file.replace(/ /g, "_")}`;

export const SLIDES: SlideSpec[] = [
  {
    id: "intro",
    image: "cover",
    alt: "Marigold garlands for the festival in Patan Durbar Square",
    kind: "cover",
    align: "left",
    credit: {
      author: "Sajin282",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      sourceUrl: commons("File:Warm wintery day in Patan Durbar square.jpg")
    }
  },
  {
    id: "roof",
    image: "roof",
    alt: "Rooftops across Kathmandu, looking out over the valley",
    kind: "chapter",
    align: "left",
    chapter: "roof",
    credit: {
      author: "Alexey Komarov",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: commons("File:Kathmandu, view from a rooftop, 17 April 2019.jpg")
    }
  },
  {
    id: "attic",
    image: "dog",
    alt: "A dog honoured with a marigold garland after Kukur Puja in Kathmandu",
    kind: "chapter",
    align: "right",
    chapter: "attic",
    credit: {
      author: "Manju",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: commons("File:Dog in Kathmandu after Kukur Puja.jpg")
    }
  },
  {
    id: "puja",
    image: "puja",
    alt: "Rows of oil lamps glowing after the evening aarti at Pashupatinath",
    kind: "chapter",
    align: "left",
    chapter: "puja",
    credit: {
      author: "Apekshaneupane",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: commons("File:Night view from the upper section of Pashupatinath Temple after the Aarti ceremony.jpg")
    }
  },
  {
    id: "kitchen",
    image: "kitchen",
    alt: "A grandmother cooking in a traditional Nepali kitchen",
    kind: "chapter",
    align: "right",
    chapter: "kitchen",
    credit: {
      author: "Mithunkunwar9",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: commons("File:Grandmother preparing food inside traditional kitchen.jpg")
    }
  },
  {
    id: "doorway",
    image: "doorway",
    alt: "A carved wooden doorway in Kathmandu",
    kind: "chapter",
    align: "left",
    chapter: "doorway",
    credit: {
      author: "Greg Willis",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
      sourceUrl: commons("File:Chusya Baha (5186681851).jpg")
    }
  },
  {
    id: "garden",
    image: "rangoli",
    alt: "A traditional Tihar rangoli drawn on the ground in Janakpur",
    kind: "chapter",
    align: "right",
    chapter: "garden",
    credit: {
      author: "Tulsi Bhagat",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: commons("File:Tihar Traditional Rangoli in Janakpur, Nepal 2016-10-30.jpeg")
    }
  },
  {
    id: "finale",
    image: "finale",
    alt: "Patan Durbar Square lit up for the evening",
    kind: "finale",
    align: "left",
    credit: {
      author: "HiraLaa",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: commons("File:Lights Patan Darwar Square.jpg")
    }
  }
];
