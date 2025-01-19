import axios from 'axios';
import fs from 'fs';
import path from 'path';
import ora from 'ora';

export class UnsplashDownloader {
    constructor(accessKey) {
        this.api = axios.create({
            baseURL: 'https://api.unsplash.com',
            headers: {
                Authorization: `Client-ID ${accessKey}`
            }
        });
    }

    async downloadImages({ query, count = 5, size = 'regular', outputDir = './unsplash-images' }) {
        const spinner = ora('Fetching images from Unsplash...').start();

        try {
            // Create output directory if it doesn't exist
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Search for photos
            const searchResponse = await this.api.get('/search/photos', {
                params: {
                    query,
                    per_page: count
                }
            });

            const photos = searchResponse.data.results;

            if (photos.length === 0) {
                spinner.fail(`No images found for query: "${query}"`);
                return;
            }

            spinner.text = 'Downloading images...';

            // Download each photo
            const downloads = photos.map(async (photo, index) => {
                const imageUrl = photo.urls[size];
                const filename = `${query.replace(/[^a-z0-9]/gi, '-')}-${photo.id}.jpg`;
                const filepath = path.join(outputDir, filename);

                const response = await axios({
                    url: imageUrl,
                    responseType: 'stream'
                });

                return new Promise((resolve, reject) => {
                    response.data
                        .pipe(fs.createWriteStream(filepath))
                        .on('finish', () => resolve())
                        .on('error', reject);
                });
            });

            await Promise.all(downloads);
            spinner.succeed(`Successfully downloaded ${photos.length} images to ${outputDir}`);

        } catch (error) {
            spinner.fail('Failed to download images');
            throw error;
        }
    }
} 