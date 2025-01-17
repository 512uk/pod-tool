import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import {Client} from 'basic-ftp';
import { readFiles } from '../lib/index.js';

const inputFolder = 'pf_in';
const outputFolder = 'pf_ready';

export async function convertPalletforcePods() {

    const tifs = await readFiles(inputFolder);

    for (const tif of tifs) {
        console.log(`Converting ${tif}`);
        const filePath = path.join(inputFolder, tif);
        await convert(filePath);
        await fs.unlinkSync(filePath);
    }

    console.log(`Converted ${tifs.length} files`);
}

export async function uploadPalletforcePods() {
    const client = new Client();
    try {
        await client.access({
            host: 'ftp.palletforce.net',
            user: 'ptf130',
            password: 'EWfkkGDF$%^32',
            secure: true
        });

        const files = await readFiles(outputFolder);

        for (const file of files) {
            console.log(`Uploading ${file}`);
            await client.uploadFrom(path.join(outputFolder, file), `PWImages/InDel/${file}`);
            await fs.unlinkSync(path.join(outputFolder, file));
        }

    } catch (error) {
        throw new Error(error)
    } finally {
        client.close();
    }   
}

async function convert(tifPath) {
    return await sharp(tifPath)
        .normalise()
        .grayscale()
        .threshold(128)
        .tiff({ compression: 'lzw' })
        .toFile(path.join(outputFolder, path.basename(tifPath)));

}