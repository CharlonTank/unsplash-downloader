# Unsplash Downloader CLI

A command-line tool to easily download images from Unsplash.

## Installation

You can use this tool without installation via npx:
```bash
npx unsplash-dl download "your search query"
```

Or install it globally:
```bash
npm install -g unsplash-dl
```

## Prerequisites

Before using this tool, you'll need:
1. Node.js >= 14.0.0
2. Unsplash API credentials (Access Key and Secret Key)
   - Go to https://unsplash.com/developers
   - Register/Login to your account
   - Create a new application
   - Copy your Access Key and Secret Key

## Usage

First time users will be guided through the configuration process automatically. You can also run the config command manually:

```bash
unsplash-dl config
```

### Download Images

Basic usage:
```bash
unsplash-dl download "mountain landscape"
```

With options:
```bash
unsplash-dl download "cats" --count 10 --size full --output-dir ./cat-photos
```

### Options

- `-n, --count <number>` - Number of images to download (default: 5)
- `-s, --size <size>` - Image size: small, regular, or full (default: regular)
- `--output-dir <path>` - Directory where images will be saved (default: ./unsplash-images)

### Examples

```bash
# Download 3 full-size mountain photos
unsplash-dl download "mountains" -n 3 -s full

# Download 10 cat pictures to a specific directory
unsplash-dl download "cats" -n 10 --output-dir ./cat-photos

# Download 5 regular-size nature photos (default)
unsplash-dl download "nature"
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
