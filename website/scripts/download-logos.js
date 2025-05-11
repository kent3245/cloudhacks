const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const stream = require('stream');

const pipeline = promisify(stream.pipeline);

// Ensure the images directory exists
const imagesDir = path.join(__dirname, '../public/images/games');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Game logos to download
const gameLogos = [
  {
    name: 'temple-run',
    url: 'https://play-lh.googleusercontent.com/5pZMqQjP8jJfopG5CkjnC7Q8vBVWdT0yDOUHywOiyUjM1O5DTD9asZ5QmITJdfA7dY=w480-h960-rw'
  },
  {
    name: 'gta',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/GTA_online_logo.png/640px-GTA_online_logo.png'
  },
  {
    name: 'minecraft',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Minecraft_logo.svg/320px-Minecraft_logo.svg.png'
  },
  {
    name: 'fortnite',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Fortnite_Logo.svg/320px-Fortnite_Logo.svg.png'
  }
];

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`);
  }
  
  const fileStream = fs.createWriteStream(filepath);
  await pipeline(response.body, fileStream);
  console.log(`Downloaded ${filepath}`);
}

async function downloadAll() {
  console.log('Starting to download game logos...');
  
  for (const game of gameLogos) {
    const filePath = path.join(imagesDir, `${game.name}.png`);
    try {
      await downloadImage(game.url, filePath);
    } catch (error) {
      console.error(`Error downloading ${game.name}:`, error.message);
    }
  }
  
  console.log('Finished downloading game logos!');
}

downloadAll().catch(console.error);
