import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import ws from 'ws';
import fs from 'fs';
import path from 'path';

// Define Mock Data Inline
const mockWorkers = [
    {
        id: 'elec-1',
        name: 'Rajesh Kumar',
        photo: '/placeholder-worker.jpg',
        category: 'electrician',
        rating: 4.8,
        reviewCount: 127,
        dailyWage: 800,
        experience: 8,
        location: 'Sector 15, Delhi',
        available: true,
        skills: ['Wiring', 'Panel Installation', 'Fault Diagnosis'],
        description: 'Certified electrician with 8 years of experience in residential and commercial electrical systems.',
        descriptionHi: 'घरेलू और व्यावसायिक विद्युत प्रणालियों में 8 वर्षों के अनुभव के साथ प्रमाणित इलेक्ट्रीशियन।',
    },
    {
        id: 'plumb-1',
        name: 'Amit Singh',
        photo: '/placeholder-worker.jpg',
        category: 'plumber',
        rating: 4.6,
        reviewCount: 95,
        dailyWage: 700,
        experience: 6,
        location: 'Dwarka, Delhi',
        available: true,
        skills: ['Pipe Fitting', 'Leak Repair', 'Sanitary Installation'],
        description: 'Expert plumber specializing in bathroom fittings and emergency leak repairs.',
        descriptionHi: 'बाथरूम फिटिंग और आपातकालीन रिसाव मरम्मत में विशेषज्ञ प्लंबर।',
    },
    {
        id: 'carp-1',
        name: 'Suresh Mistry',
        photo: '/placeholder-worker.jpg',
        category: 'carpenter',
        rating: 4.9,
        reviewCount: 200,
        dailyWage: 900,
        experience: 12,
        location: 'Noida, UP',
        available: false,
        skills: ['Furniture Making', 'Polishing', 'Door Installation'],
        description: 'Master carpenter known for custom furniture and intricate woodworks.',
        descriptionHi: 'कस्टम फर्नीचर और जटिल लकड़ी के काम के लिए जाने जाने वाले मास्टर बढ़ई।',
    },
    {
        id: 'paint-1',
        name: 'Vikram Das',
        photo: '/placeholder-worker.jpg',
        category: 'painter',
        rating: 4.7,
        reviewCount: 150,
        dailyWage: 600,
        experience: 5,
        location: 'Gurgaon, Haryana',
        available: true,
        skills: ['Wall Painting', 'Texture Design', 'Waterproofing'],
        description: 'Professional painter with expertise in modern texture designs and waterproofing.',
        descriptionHi: 'आधुनिक बनावट डिजाइन और वॉटरप्रूफिंग में विशेषज्ञता वाले पेशेवर पेंटर।',
    },
];

// Manual .env loading fallback
try {
    const envPath = path.resolve(__dirname, '../.env');
    console.log('Loading .env from:', envPath);
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["'](.*)["']$/, '$1'); // Remove quotes
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.error('Failed to load .env manually:', e);
}

// Simplified Prisma Client for Seeding
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    for (const worker of mockWorkers) {
        const existingWorker = await prisma.worker.findFirst({
            where: { id: worker.id }
        });

        if (!existingWorker) {
            await prisma.worker.create({
                data: {
                    id: worker.id,
                    name: worker.name,
                    photo: worker.photo,
                    category: worker.category,
                    rating: worker.rating,
                    reviewCount: worker.reviewCount,
                    dailyWage: worker.dailyWage,
                    experience: worker.experience,
                    location: worker.location,
                    available: worker.available,
                    skills: worker.skills,
                    description: worker.description,
                    descriptionHi: worker.descriptionHi,
                },
            });
            console.log(`Created worker with id: ${worker.id}`);
        } else {
            console.log(`Worker with id: ${worker.id} already exists`);
        }
    }
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
