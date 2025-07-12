# VisualUSDM

Creating a Visual USDM Editor

## 🚀 Modern Technology Stack

This application is built with state-of-the-art technologies:

- **Next.js 15** - Latest React framework with App Router
- **React 18** - Modern UI library with concurrent features
- **Material-UI (MUI) v6** - Latest comprehensive component library
- **TypeScript 5** - Type-safe JavaScript for better DX
- **ESLint & Prettier** - Code quality and formatting

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd VisualUSDM

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Environment Variables

The application uses environment variables for configuration:

- `NEXT_PUBLIC_BASE_PATH` - Base path for deployment (e.g., `/VisualUSDM` for GitHub Pages)

**Environment Files:**
- `.env.local` - Local development overrides (not committed)
- `.env.development` - Development environment (empty basePath for local dev)
- `.env.production` - Production environment (with basePath for GitHub Pages)
- `.env.example` - Example configuration file

For local development, the basePath is empty. For GitHub Pages deployment, it's automatically set to `/VisualUSDM`.

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Example Files

The following file is an example

| File                   | Origin                                                                                               | Description                                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| CDISC_Pilot_Study.json | [CDISC DDF Example](https://github.com/cdisc-org/DDF-RA/tree/v3.12.0/Documents/Examples/CDISC_Pilot) | Example USDM file as delivered by CDISC for the DDF Pilot ([MIT License](https://github.com/cdisc-org/DDF-RA/blob/v3.12.0/LICENSE)) |

## 🚀 Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Setup Instructions:

1. **Enable GitHub Pages:**
   - Go to your repository Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Automatic Deployment:**
   - Push to the `main` branch triggers automatic deployment
   - The workflow builds the Next.js app and deploys to GitHub Pages
   - Your site will be available at: `https://yourusername.github.io/VisualUSDM/`

3. **Manual Deployment:**
   - Go to Actions tab in your GitHub repository
   - Click "Deploy to GitHub Pages" workflow
   - Click "Run workflow" button

#### Workflow Features:

- ✅ Automatic builds on push to main branch
- ✅ Static site generation optimized for GitHub Pages
- ✅ Material-UI optimization for faster loading
- ✅ TypeScript compilation and validation
- ✅ Production-ready minification and optimization

The deployment workflow is configured in `.github/workflows/deploy.yml` and uses Next.js static export feature for optimal GitHub Pages compatibility.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
