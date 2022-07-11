export interface List {
    title: { form: string, name: string },
    type: 'Privat' | 'Geteilt' | 'Voting',
    images: [string, string, string],
    color: 'Rot' | 'Grün' | 'Gelb' | 'Orange' | 'Lila',
    description?: string,
    uid?: string,
}
