import dotenv from "dotenv";
dotenv.config();

import PalletforcePodProcessor from "./controllers/PalletforcePodProcessor.js";
import HazchemPodProcessor from "./controllers/HazchemPodProcessor.js";
import FtpClient from "./services/FtpClient.js";
import ImageProcessor from "./services/ImageProcessor.js";
import FileRepository from "./services/FileRepository.js";

try {
  const palletforceFtpClient = new FtpClient({
    host: process.env.PF_HOST,
    user: process.env.PF_USER,
    password: process.env.PF_PASSWORD,
    secure: true,
  });

  const fileRepository = new FileRepository();
  const imageProcessor = new ImageProcessor();

  const pfProcessor = new PalletforcePodProcessor(
    palletforceFtpClient,
    fileRepository,
    imageProcessor
  );

  await pfProcessor.processTiffFiles(
    process.env.PF_INPUT_FOLDER,
    process.env.PF_ARCHIVE_FOLDER
  );

  const hazchemFtp = new FtpClient({
    host: process.env.HAZ_HOST,
    user: process.env.HAZ_USER,
    password: process.env.HAZ_PASSWORD,
    secure: false,
  });

  const hazProcessor = new HazchemPodProcessor(
    hazchemFtp,
    fileRepository,
    imageProcessor
  );

  await hazProcessor.processTiffFiles(
    process.env.HAZ_INPUT_FOLDER,
    process.env.HAZ_ARCHIVE_FOLDER
  );

  console.log("Finished");
} catch (error) {
  console.error(error, error.message);
  process.exit(1);
}
