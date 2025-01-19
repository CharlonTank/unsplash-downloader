#!/usr/bin/env node

import { Command } from 'commander';
import { getConfig, setupConfig } from './config.js';
import { UnsplashDownloader } from './downloader.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';
import { join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json')));

const program = new Command();

program
    .name('unsplash-dl')
    .description('A command-line tool to easily download images from Unsplash')
    .version(pkg.version)
    .addHelpText('after', `
Commands:
  config                      Configure your Unsplash API credentials
  download [options] [query]  Download images from Unsplash

Download Options:
  -n, --count <number>       Number of images to download (default: 5)
  -s, --size <size>         Image size: small, regular, or full (default: regular)
  -o, --output <path>       Output directory (default: ./unsplash-images)

Examples:
  # First time setup
  $ unsplash-dl config

  # Download 3 full-size mountain photos
  $ unsplash-dl download "mountains" -n 3 -s full

  # Download 10 cat pictures to a specific directory
  $ unsplash-dl download "cats" -n 10 -o ./cat-photos

  # Download 5 regular-size nature photos (default)
  $ unsplash-dl download "nature"

Note: You'll need Unsplash API credentials to use this tool.
To get your credentials:
1. Go to https://unsplash.com/developers
2. Register/Login to your account
3. Create a new application
4. Copy your Access Key and Secret Key`);

program
    .command('config')
    .description('Configure your Unsplash API credentials')
    .addHelpText('after', `
Note: You'll need Unsplash API credentials to use this tool.
To get your credentials:
1. Go to https://unsplash.com/developers
2. Register/Login to your account
3. Create a new application
4. Copy your Access Key and Secret Key`)
    .action(async () => {
        try {
            await setupConfig();
        } catch (error) {
            console.error('Error setting up configuration:', error.message);
            process.exit(1);
        }
    });

program
    .command('download [query]')
    .description('Download images from Unsplash')
    .option('-n, --count <number>', 'number of images to download', '5')
    .option('-s, --size <size>', 'image size (small, regular, full)', 'regular')
    .option('-o, --output <path>', 'output directory', './unsplash-images')
    .addHelpText('after', `
Examples:
  # Download 3 full-size mountain photos
  $ unsplash-dl download "mountains" -n 3 -s full

  # Download 10 cat pictures to a specific directory
  $ unsplash-dl download "cats" -n 10 -o ./cat-photos

  # Download 5 regular-size nature photos (default)
  $ unsplash-dl download "nature"`)
    .action(async (query, options) => {
        try {
            const config = await getConfig();
            if (!config) {
                process.exit(1);
            }

            const downloader = new UnsplashDownloader(config.accessKey);
            await downloader.downloadImages({
                query,
                count: parseInt(options.count),
                size: options.size,
                outputDir: options.output
            });
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

program.parse(); 