// components/header/navData.ts

export type NavChild = {
  label: string;
  slug: string; // sub-category
};

export type NavItemType = {
  label: string;
  slug: string; // main category
  children?: NavChild[];
};

export const NAV_ITEMS: NavItemType[] = [
  {
    label: "Men",
    slug: "men",
    children: [
      { label: "Shirts", slug: "shirts" },
      { label: "T-Shirts", slug: "t-shirts" },
      { label: "Kurta", slug: "kurta" },
      { label: "Jeans", slug: "jeans" },
      { label: "Winter Wear", slug: "winter-wear" },
    ],
  },
  {
    label: "Women",
    slug: "women",
    children: [
      { label: "Saree", slug: "saree" },
      { label: "Kurti", slug: "kurti" },
      { label: "Suit", slug: "suit" },
      { label: "Western Wear", slug: "western" },
    ],
  },
  {
    label: "Kids",
    slug: "kids",
    children: [
      { label: "Boys", slug: "boys" },
      { label: "Girls", slug: "girls" },
      { label: "Infants", slug: "infants" },
    ],
  },
  {
    label: "Footwear",
    slug: "footwear",
    children: [
      { label: "Men Footwear", slug: "men" },
      { label: "Women Footwear", slug: "women" },
      { label: "Kids Footwear", slug: "kids" },
    ],
  },
];
