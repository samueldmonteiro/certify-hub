import fs from 'fs';

export const imageToBase64 = (imagePath: string): string => {
  const buffer = fs.readFileSync(imagePath);
  return `data:image/png;base64,${buffer.toString('base64')}`;
};
