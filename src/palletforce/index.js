import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { Client } from 'basic-ftp';
import { readFiles } from '../entities/lib/index.js';

export class PalletforcePods {
    constructor(config) {
        if (!config.palletforceHost) {
            throw new Error('Palletforce FTP Host is required');
        }

        if (!config.palletforceUser) {
            throw new Error('Palletforce FTP login user is required');
        }

        if (!config.palletforcePassword) {
            throw new Error('Palletforce FTP login password is required');
        }

        if (!config.palletforceInputFolder) {
            throw new Error('Palletforce input folder is required');
        }

        if (!config.palletforceArchiveFolder) {
            throw new Error('Palletforce archive folder is required');
        }

        this.config = config;
    }
}


async function processPfPods() {
    
    const client = new Client();

    try {
        await client.access({
            host: process.env.PF_HOST,
            user: process.env.PF_USER,
            password: process.env.PF_PASSWORD,
            secure: true
        });

        const tifs = await readFiles(inputFolder);

        for (const tif of tifs) {
            console.log(`Converting ${tif}`);
            const inputFilePath = path.join(inputFolder, tif);
            await process(inputFilePath);

            console.log(`Uploading ${file}`);
            await client.uploadFrom(inputFilePath, `PWImages/InDel/${file}`);

            await fs.moveSync(inputFilePath, path.join(archiveFolder, tif));
        }

    } catch (error) {
        // rethrow so it can be caught by the main process
        throw new Error(error);
    } finally {
        client.close();
    }

    console.log(`Converted ${tifs.length} files`);
}

/**
 * Process a tif file
 * Normalise, grayscale, threshold (converts to B&W by setting a midpoint of grayscale) and compress the image in LZW format
 */
async function process(tifPath) {
    return await sharp(tifPath)
        .normalise()
        .grayscale()
        .threshold(128)
        .tiff({ compression: 'lzw' })
        .toFile(path.join(outputFolder, path.basename(tifPath)));
}