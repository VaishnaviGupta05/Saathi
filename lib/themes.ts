export type ThemeId = "paper" | "rosewater" | "old-soul" | "moonlight" | "garden";

export type DiaryTheme = {
  id: ThemeId;
  name: string;
  description: string;
  symbol: string;
  kicker: string;
  coverTitle: string;
  subtitle: string;
  flower: string;
};

export const themes: DiaryTheme[] = [
  { id: "paper", name: "Everyday Pages", description: "A clean, comforting classic", symbol: "✳", kicker: "A PLACE TO BEGIN", coverTitle: "little\nmoments", subtitle: "MY DAILY PAGES", flower: "✺" },
  { id: "rosewater", name: "Rosewater", description: "Soft petals and tender thoughts", symbol: "❀", kicker: "NOTES FROM THE HEART", coverTitle: "in bloom", subtitle: "A GENTLE JOURNAL", flower: "✿" },
  { id: "old-soul", name: "Old Soul", description: "For letters and long thoughts", symbol: "❧", kicker: "PRIVATE CORRESPONDENCE", coverTitle: "dear\nsomewhere", subtitle: "LETTERS TO MYSELF", flower: "❦" },
  { id: "moonlight", name: "Moonlight", description: "For the quiet hours", symbol: "☾", kicker: "AFTER THE WORLD GOES QUIET", coverTitle: "moonlit", subtitle: "MIDNIGHT THOUGHTS", flower: "✧" },
  { id: "garden", name: "Little Garden", description: "A breath of green and calm", symbol: "❋", kicker: "GROW AT YOUR OWN PACE", coverTitle: "slowly,\nsoftly", subtitle: "A GROWING JOURNAL", flower: "❧" }
];
