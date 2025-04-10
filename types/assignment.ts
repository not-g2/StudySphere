export interface Assignment {
    _id: number;
    title: string;
    dueDate: string;
    course?: string;
    description?: string;
    link?: string;
    createdAt?: string;
}
