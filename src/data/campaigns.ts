export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type Submission = {
  id: string;
  campaignId: string;
  videoUrl: string;
  submittedAt: string;
  status: SubmissionStatus;
  feedback?: string;
};

export type Campaign = {
  id: string;
  brandName: string;
  brandLogo: string;
  category: string;
  payoutPerVideo: number;
  currency: string;
  deadline: string;
  deadlineLabel: string;
  title: string;
  description: string;
  brief: string;
  requirements: string[];
  exampleVideos: { url: string; thumbnail: string; caption: string }[];
  tags: string[];
  spotsLeft: number;
  totalCreators: number;
  platform: ('TikTok' | 'Instagram')[];
  minFollowers: number;
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    brandName: 'Loom Coffee Co.',
    brandLogo: '☕',
    category: 'Food & Drink',
    payoutPerVideo: 120,
    currency: 'USD',
    deadline: '2026-04-20T23:59:00Z',
    deadlineLabel: '4 days left',
    title: 'Morning Routine with Loom Coffee',
    description:
      'Show your authentic morning ritual featuring Loom Coffee. We want real creators, real moments — no overproduced ads. Just you, your mug, and your vibe.',
    brief:
      '## What We Want\n\nCreate a 30–60 second TikTok or Instagram Reel showing your genuine morning routine featuring Loom Coffee.\n\n## Key Messages\n- "Start your day right"\n- Loom Coffee = clean energy, no jitters\n- Sustainable packaging (mention the eco-friendly cups)\n\n## Do\'s\n- Natural lighting preferred\n- Show the brewing process\n- Genuine reaction to first sip\n\n## Don\'ts\n- No overly scripted content\n- Don\'t hide the brand logo\n- No competitor products in frame',
    requirements: [
      'Video 30–60 seconds',
      'Show product clearly in first 3 seconds',
      'Tag @loomcoffeeco',
      'Use #LoomMorning hashtag',
      'Natural/authentic tone',
    ],
    exampleVideos: [
      {
        url: 'https://www.tiktok.com/@loomcoffee/example1',
        thumbnail: 'https://picsum.photos/seed/coffee1/400/700',
        caption: 'Morning ritual by @sara.creates — 2.1M views',
      },
      {
        url: 'https://www.instagram.com/reel/loomex2',
        thumbnail: 'https://picsum.photos/seed/coffee2/400/700',
        caption: 'Cozy Sunday vibe by @jakemakes — 890K views',
      },
    ],
    tags: ['lifestyle', 'coffee', 'morning', 'wellness'],
    spotsLeft: 8,
    totalCreators: 20,
    platform: ['TikTok', 'Instagram'],
    minFollowers: 5000,
  },
  {
    id: 'c2',
    brandName: 'Pulse Fitness',
    brandLogo: '⚡',
    category: 'Health & Fitness',
    payoutPerVideo: 200,
    currency: 'USD',
    deadline: '2026-04-18T23:59:00Z',
    deadlineLabel: '2 days left',
    title: '30-Day Challenge Kickoff',
    description:
      'Launch your 30-day Pulse Fitness challenge. We need high-energy creators who live and breathe fitness to authentically showcase our app.',
    brief:
      '## Campaign Brief\n\nCreate a motivational video launching your personal 30-day challenge using the Pulse Fitness app.\n\n## Key Messages\n- Pulse Fitness makes working out fun\n- Track every rep, every mile\n- Community-powered accountability\n\n## Content Ideas\n- Filming your Day 1 workout\n- Showing the app\'s challenge dashboard\n- Inviting followers to join you\n\n## Technical Requirements\n- Vertical video (9:16)\n- Minimum 1080p resolution\n- Include app screen recording (min 5 seconds)',
    requirements: [
      'Vertical 9:16 format, min 1080p',
      'Show app screen recording (5+ seconds)',
      'Include your "why" story',
      'Tag @pulsefitapp',
      'Use #PulseChallenge30',
    ],
    exampleVideos: [
      {
        url: 'https://www.tiktok.com/@pulsefitness/example1',
        thumbnail: 'https://picsum.photos/seed/fitness1/400/700',
        caption: 'Day 1 energy by @alex_lifts — 4.7M views',
      },
    ],
    tags: ['fitness', 'challenge', 'motivation', 'health'],
    spotsLeft: 3,
    totalCreators: 15,
    platform: ['TikTok', 'Instagram'],
    minFollowers: 10000,
  },
  {
    id: 'c3',
    brandName: 'Aether Skincare',
    brandLogo: '✨',
    category: 'Beauty',
    payoutPerVideo: 175,
    currency: 'USD',
    deadline: '2026-04-25T23:59:00Z',
    deadlineLabel: '9 days left',
    title: 'The Glow-Up Routine',
    description:
      'Feature Aether\'s new Vitamin C serum in your skincare routine. Clean, minimal, honest — show real before/after skin texture.',
    brief:
      '## What We\'re Looking For\n\nAuthentic skincare routine content featuring the Aether Vitamin C Glow Serum.\n\n## Messaging\n- "Skin that actually glows"\n- No filters needed\n- Dermatologist-tested formula\n\n## Content Guidelines\n- Start with bare skin / minimal makeup\n- Apply serum on camera\n- End with your glowing result\n- Honest review is encouraged — we stand behind our product\n\n## Hashtags\n#AetherGlow #RealSkin #GlowUp',
    requirements: [
      'Show product application',
      'No heavy filters on skin shots',
      'Mention "dermatologist-tested"',
      'Before/after or routine format',
      'Tag @aetherskin',
    ],
    exampleVideos: [
      {
        url: 'https://www.tiktok.com/@aetherskin/example1',
        thumbnail: 'https://picsum.photos/seed/skin1/400/700',
        caption: 'Glow routine by @mia.beauty — 1.3M views',
      },
      {
        url: 'https://www.instagram.com/reel/aether2',
        thumbnail: 'https://picsum.photos/seed/skin2/400/700',
        caption: 'No filter needed by @purebeauty — 560K views',
      },
    ],
    tags: ['skincare', 'beauty', 'glow', 'routine'],
    spotsLeft: 12,
    totalCreators: 25,
    platform: ['TikTok', 'Instagram'],
    minFollowers: 3000,
  },
  {
    id: 'c4',
    brandName: 'Nova Headphones',
    brandLogo: '🎧',
    category: 'Tech',
    payoutPerVideo: 300,
    currency: 'USD',
    deadline: '2026-04-22T23:59:00Z',
    deadlineLabel: '6 days left',
    title: 'Sound. Uninterrupted.',
    description:
      'Showcase the Nova ANC Pro headphones in your creative workspace or on-the-go. We want to see how Nova fits into your world.',
    brief:
      '## Campaign Overview\n\nNova Pro is our flagship ANC headphone. We want creators to integrate it naturally into their content.\n\n## Key Features to Highlight\n- 40hr battery life\n- Industry-leading noise cancellation\n- Premium build (aluminum + leather)\n- Spatial audio support\n\n## Content Angle Ideas\n- "My focus playlist" — study/work session\n- Commute / public transport shots\n- Unboxing + first impressions\n- Side-by-side ANC demo\n\n## Visual Style\n- Cinematic, moody tones\n- Product close-ups welcome\n- Show both wearing and holding the headphones',
    requirements: [
      'Mention ANC and battery life',
      'Show headphones in use minimum 10 seconds',
      'Cinematic or high-quality aesthetic',
      'Tag @novaaudio',
      'Use #NovaSound',
    ],
    exampleVideos: [
      {
        url: 'https://www.tiktok.com/@novaaudio/example1',
        thumbnail: 'https://picsum.photos/seed/tech1/400/700',
        caption: 'Focus mode by @dev.life — 3.2M views',
      },
      {
        url: 'https://www.tiktok.com/@novaaudio/example2',
        thumbnail: 'https://picsum.photos/seed/tech2/400/700',
        caption: 'Commute vibes by @citywalks — 980K views',
      },
    ],
    tags: ['tech', 'audio', 'music', 'productivity'],
    spotsLeft: 5,
    totalCreators: 10,
    platform: ['TikTok', 'Instagram'],
    minFollowers: 15000,
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    campaignId: 'c1',
    videoUrl: 'https://www.tiktok.com/@yourcreator/morning-with-loom',
    submittedAt: '2026-04-15T09:30:00Z',
    status: 'approved',
    feedback: 'Great authentic content! Loved the brewing close-up.',
  },
  {
    id: 's2',
    campaignId: 'c3',
    videoUrl: 'https://www.instagram.com/reel/your-glow-routine',
    submittedAt: '2026-04-14T14:00:00Z',
    status: 'rejected',
    feedback: 'Video quality was below our 1080p requirement.',
  },
];
