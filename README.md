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

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with MUI theme
│   ├── page.tsx            # Home page
│   ├── theme.ts            # MUI theme configuration
│   ├── editor/
│   │   └── page.tsx        # USDM Editor page
│   └── about/
│       └── page.tsx        # About page
├── Example/
│   └── CDISC_Pilot_Study.json
└── public/
    └── favicon.ico
```

## ✨ Features

- **Visual JSON Editor** - Edit USDM documents with syntax highlighting
- **Real-time Validation** - Instant JSON validation and error reporting
- **Import/Export** - Load and save USDM files
- **Example Templates** - Pre-built CDISC examples
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean Material Design interface

## Example Files

The following file is an example

File | Origin | Description
--- | --- | ---
CDISC_Pilot_Study.json | [CDISC DDF Example](https://github.com/cdisc-org/DDF-RA/tree/v3.12.0/Documents/Examples/CDISC_Pilot) | Example USDM file as delivered by CDISC for the DDF Pilot ([MIT License](https://github.com/cdisc-org/DDF-RA/blob/v3.12.0/LICENSE))

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.