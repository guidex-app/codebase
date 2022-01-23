export interface Filter {
    title: { name: string, form: string, icon: any },
    inputType: 'radio' | 'checkbox',
    data: { name: string, form: string, icon: any }[],
}
