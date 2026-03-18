export interface RoleplayScenario {
    id: string;
    title: string;
    description: string;
    roles: {
        A: string;
        B: string;
    };
    prompts: {
        A: string[];
        B: string[];
    };
    icon?: string;
}

export const SCENARIOS: RoleplayScenario[] = [
    {
        id: 'job-interview',
        title: 'Job Interview',
        description: 'Practice a professional interview for a dream job.',
        roles: {
            A: 'Interviewer',
            B: 'Candidate'
        },
        prompts: {
            A: [
                'Tell me about yourself.',
                'Why do you want to work for this company?',
                'What are your greatest strengths and weaknesses?'
            ],
            B: [
                'Introduce yourself professionally.',
                'Explain how your skills match the role.',
                'Ask a question about the company culture.'
            ]
        },
        icon: '💼'
    },
    {
        id: 'first-date',
        title: 'First Date',
        description: 'Navigate the excitement and nerves of a first meeting.',
        roles: {
            A: 'Person A',
            B: 'Person B'
        },
        prompts: {
            A: [
                'What do you like to do in your free time?',
                'Tell me about your favorite travel experience.',
                'What kind of music are you into?'
            ],
            B: [
                'Share an interesting hobby you have.',
                'Describe your perfect weekend.',
                'What is something you\'ve always wanted to try?'
            ]
        },
        icon: '💑'
    },
    {
        id: 'airport-conversation',
        title: 'Airport Check-in',
        description: 'Handle travel logistics with an airport official.',
        roles: {
            A: 'Traveler',
            B: 'Officer'
        },
        prompts: {
            A: [
                'I\'d like to check in for my flight to London.',
                'Is there a window seat available?',
                'How much is the fee for an extra bag?'
            ],
            B: [
                'Can I see your passport and ticket, please?',
                'Are you carrying any prohibited items?',
                'Please place your suitcase on the scale.'
            ]
        },
        icon: '✈️'
    },
    {
        id: 'restaurant',
        title: 'At a Restaurant',
        description: 'Order food and handle requests in a dining setting.',
        roles: {
            A: 'Customer',
            B: 'Waiter'
        },
        prompts: {
            A: [
                'Could we see the menu, please?',
                'What do you recommend for the main course?',
                'Could we have the check, please?'
            ],
            B: [
                'Are you ready to order, or do you need a few more minutes?',
                'How would you like your steak cooked?',
                'Is everything okay with your meal?'
            ]
        },
        icon: '🍽️'
    },
    {
        id: 'business-meeting',
        title: 'Business Meeting',
        description: 'Discuss strategy and goals in a corporate environment.',
        roles: {
            A: 'Client',
            B: 'Manager'
        },
        prompts: {
            A: [
                'What are the key deliverables for this project?',
                'We have some concerns about the timeline.',
                'How will success be measured?'
            ],
            B: [
                'Let\'s go over the agenda for today.',
                'We\'ve made significant progress on the first phase.',
                'What are your main priorities for next quarter?'
            ]
        },
        icon: '🤝'
    },
    {
        id: 'hotel-check-in',
        title: 'Hotel Check-in',
        description: 'Practice checking into a hotel and handling room issues.',
        roles: {
            A: 'Receptionist',
            B: 'Guest'
        },
        prompts: {
            A: [
                'Welcome to Norinly Hotel, how can I help you?',
                'May I see your ID and booking confirmation?',
                'Your room is on the 5th floor, here is your key card.'
            ],
            B: [
                'I have a reservation under the name Saqib Fayaz.',
                'Is breakfast included in the stay?',
                'I have a concern, my key card isn\'t working.'
            ]
        },
        icon: '🏨'
    }
];
