export interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;       // Display string, e.g. "March 2026"
    dateISO: string;    // ISO 8601 for sorting and structured data
}

export const posts: Post[] = [
    {
        slug: 'mailto',
        title: 'mailto: and the Problem with Silent Failure',
        description:
            'On opaque delegation, a 32-year-old URI scheme, and why good engineering means choosing how things break.',
        date: 'March 2026',
        dateISO: '2026-03-01',
    },
];

// Pre-sorted newest-first so pages can consume directly.
posts.sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
);