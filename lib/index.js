import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readFiles(inputFolder) {
    const files = await fs.readdirSync(path.resolve(inputFolder));
    return files.filter(file => path.extname(file) === '.tif');
}

export async function getMetadata(tifPath) {
    return await sharp(path.resolve(tifPath)).metadata();
}