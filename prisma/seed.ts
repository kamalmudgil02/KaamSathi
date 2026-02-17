import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { mockWorkers } from '../data/mockData';
import dotenv from 'dotenv';
import ws from 'ws';

import fs from 'fs';
import path from 'path';

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

neonConfig.webSocketConstructor = ws;
// Parse URL manually to ensure Pool gets correct config
const connectionString = `${process.env.DATABASE_URL}`;
console.log('Database URL:', connectionString);

let poolConfig: any = { connectionString };

try {
    const url = new URL(connectionString);
    poolConfig = {
        host: url.hostname,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading /
        ssl: true,
    };
    console.log('Parsed Config:', JSON.stringify({ ...poolConfig, password: '***' }, null, 2));
} catch (e) {
    console.error('Failed to parse URL:', e);
}

const pool = new Pool(poolConfig);
const adapter = new PrismaNeon(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding ...');

    for (const worker of mockWorkers) {
        const existingWorker = await prisma.worker.findFirst({
            where: { id: worker.id }
        });

        if (!existingWorker) {
            const result = await prisma.worker.create({
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
            console.log(`Created worker with id: ${result.id}`);
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
