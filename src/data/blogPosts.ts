export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    content?: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: 'how-to-overcome-language-barrier',
        title: '5 Proven Ways to Overcome Language Barrier in 2024',
        description: 'Struggling to speak English naturally? Discover the psychological and practical tips to break the barrier today.',
        category: 'Tips & Tricks',
        date: 'March 15, 2024',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    },
    {
        slug: 'benefits-of-anonymous-learning',
        title: 'Why Anonymity is Your Best Friend When Learning English',
        description: 'Fear of judgment is the biggest hurdle. Learn how talking to strangers anonymously can boost your fluency 2x faster.',
        category: 'Learning Strategy',
        date: 'March 10, 2024',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    },
    {
        slug: 'the-science-of-fluency',
        title: 'The Science of Fluency: How Daily Speaking Rewires Your Brain',
        description: 'Did you know speaking activates different brain regions than reading? Here is why conversation is the key to mastery.',
        category: 'Education',
        date: 'March 05, 2024',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    }
];
