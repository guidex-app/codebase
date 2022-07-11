export interface List {
    title: { form: string, name: string },
    type: 'Privat' | 'Geteilt' | 'Voting',
    images: [string, string, string],
    color: 'Rot' | 'Grün' | 'Gelb' | 'Orange' | 'Lila',
    description?: string,
    uid?: string,
    vote?: number,
}

export interface ListCat {
    title: { name:string, form:string },
    vote: number,
}
