export type HighlightContentBlock =
    | { type: 'paragraph'; text: string }
    | { type: 'subheading'; text: string }
    | { type: 'list'; heading?: string; items: string[] };

export type HighlightItem = {
    title: string;
    description: string;
    actionLabel: string;
    content: HighlightContentBlock[];
};

export type AgendaEvent = {
    date: string;
    time: string;
    title: string;
    location: string;
    description: string;
    image: string;
    start: string;
    end: string;
};
