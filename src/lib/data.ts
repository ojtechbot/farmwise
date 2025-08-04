import type { Tutorial } from './types';

export const tutorials: Tutorial[] = [
  {
    id: '1',
    slug: 'soil-health-basics',
    title: 'Soil Health Basics',
    description: 'Understand the fundamentals of soil composition and health for better crop yield.',
    category: 'Crop Production',
    imageUrl: 'https://placehold.co/600x400.png',
    lessons: [
      {
        id: '1-1',
        slug: 'intro-to-soil',
        title: 'Introduction to Soil',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: 'Soil is the foundation of agriculture. This lesson covers the basic components of soil: minerals, organic matter, water, and air. We will explore how these components interact and why they are crucial for plant growth. A healthy soil structure is vital for nutrient cycling and water retention.',
        quiz: [
          {
            question: 'What are the four main components of soil?',
            options: ['Rocks, Sand, Clay, Silt', 'Minerals, Organic Matter, Water, Air', 'Fertilizer, Pesticides, Water, Sun', 'Nitrogen, Phosphorus, Potassium, Water'],
            correctAnswer: 'Minerals, Organic Matter, Water, Air',
          },
        ],
      },
      {
        id: '1-2',
        slug: 'soil-testing',
        title: 'How to Test Your Soil',
        content: 'Learn the importance of soil testing and how to collect a proper sample. This lesson provides step-by-step instructions on interpreting soil test results to make informed decisions about fertilization and amendments.',
        quiz: [
          {
            question: 'Why is soil testing important?',
            options: ['To know the color of the soil', 'To determine nutrient levels and pH', 'To count the number of earthworms', 'To measure soil temperature'],
            correctAnswer: 'To determine nutrient levels and pH',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    slug: 'intro-fish-farming',
    title: 'Introduction to Fish Farming',
    description: 'Get started with the basics of aquaculture and setting up your first fish pond.',
    category: 'Fish Farming',
    imageUrl: 'https://placehold.co/600x400.png',
    lessons: [
      {
        id: '2-1',
        slug: 'pond-design',
        title: 'Pond Design and Construction',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: 'Proper pond design is critical for a successful fish farm. This lesson covers site selection, pond layout, and construction techniques. We will discuss water sources, drainage, and how to create a healthy environment for your fish.',
        quiz: [
          {
            question: 'What is a key consideration in pond site selection?',
            options: ['Proximity to a busy road', 'Access to a reliable water source', 'The number of nearby trees', 'The type of fish you like to eat'],
            correctAnswer: 'Access to a reliable water source',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    slug: 'organic-pest-control',
    title: 'Organic Pest Control',
    description: 'Learn how to manage pests in your farm using organic and sustainable methods.',
    category: 'Pest Control',
    imageUrl: 'https://placehold.co/600x400.png',
    lessons: [
       {
        id: '3-1',
        slug: 'identifying-pests',
        title: 'Identifying Common Pests',
        content: 'The first step to pest control is proper identification. Learn to recognize common garden pests and the damage they cause. This lesson includes a visual guide to insects, mites, and other common agricultural pests.',
        quiz: [
          {
            question: 'What is the first step in effective pest control?',
            options: ['Spraying pesticides everywhere', 'Properly identifying the pest', 'Bringing in ladybugs', 'Watering the plants more'],
            correctAnswer: 'Properly identifying the pest',
          },
        ],
      },
    ],
  },
   {
    id: '4',
    slug: 'effective-fertilizer-use',
    title: 'Effective Fertilizer Use',
    description: 'Maximize your crop yield by learning the right way to apply fertilizers.',
    category: 'Crop Production',
    imageUrl: 'https://placehold.co/600x400.png',
    lessons: [
       {
        id: '4-1',
        slug: 'understanding-npk',
        title: 'Understanding N-P-K',
        content: 'N-P-K stands for Nitrogen, Phosphorus, and Potassium. These are the three primary macronutrients essential for plant growth. This lesson explains the role of each nutrient and how to read fertilizer labels to choose the right product for your crops.',
        quiz: [
          {
            question: 'What does N-P-K stand for?',
            options: ['Nitrate, Phosphate, Karbon', 'Nitrogen, Phosphorus, Potassium', 'Nourish, Plant, Keep', 'New, Potent, Killer'],
            correctAnswer: 'Nitrogen, Phosphorus, Potassium',
          },
        ],
      },
    ],
  },
];
