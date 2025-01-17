import { convertPalletforcePods, uploadPalletforcePods } from './palletforce/index.js';

try { 
    await convertPalletforcePods();
    await uploadPalletforcePods();

} catch (error) {
    console.error(error);
    process.exit(1);
}