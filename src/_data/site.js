/*
  Facts about the studio that are the same in every language.
  Texts that change per language live in src/en/en.11tydata.yaml.
*/
export default {
  name: "Nikola Znaor Architects",

  // Changes on every build, so browsers load the new CSS and JS instead of an old cached copy.
  version: Date.now().toString(36),

  // The final web address. Used for SEO and social media previews.
  url: "https://nikolaznaor.com",

  // Studio email (as published on nikolaznaor.com/contact).
  email: "info@nikolaznaor.com",

  // The filter buttons on Work and Home, always shown in this order.
  categories: ["building", "pavilion", "house", "renovation", "competition", "research"],

  // Languages the site is published in, in the order shown in the language switch.
  // `prefix` is the start of every web address in that language (English has none).
  // To add German later: add { code: "de", label: "DE", prefix: "/de" } and a src/de/ folder.
  languages: [
    { code: "en", label: "EN", prefix: "" },
    { code: "nl", label: "NL", prefix: "/nl" },
    { code: "hr", label: "HR", prefix: "/hr" },
  ],
};
