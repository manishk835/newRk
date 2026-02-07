export type Category = {
    _id: string;
    name: string;
    slug: string;
    parent?: string | null;  
    parentSlug?: string;
  };
  
  