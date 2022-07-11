// export interface Categories {
//   date: string;
//   groups: CategoriesGroup[]
// }
// export interface Categories {
//   date: string;
//   groups: CategoriesGroup[]

//   // id?: string,
//   // catId?: string,
//   // name: string,
//   // smallImage?: string,
//   // titelform: string,
//   // age: string,
//   // price: string,
//   // person: string,
//   // time: string,
//   // icon?: string,
//   // tags: Object,
// }

// export interface Cats {
//   id?: string,
//   catId: string,
//   name: string,
//   smallImage?: string,
//   titelform: string,
//   title: { form: string, name: string },
//   age: string,
//   price: string,
//   person: string,
//   time: string,
//   icon?: string,
//   tags: any,
// }

export interface CatInfo {
    title: { name:string, form:string },
    description: string,

    belongsTo?: string,

    filter: string[],
  }

export interface Cat {
    title: { name:string, form:string },
    description: string,
    filter: string[],

    geohash: string,
    allowed: string[],
    count: { indoor: number, outdoor: number };
    sortCount: number;
  }

export interface CatFilter {
    filterData: string[],
    weather?: string[],
    tags?: string[],
    age?: string[],
    price?: string[],
    person?: string[],
    time?: string[],
    location?: string[],
    sort?: string[],
  }
