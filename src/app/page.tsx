'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Container,
  Paper,
} from '@mui/material';
import { Edit, FileOpen, Info, CloudDownload } from '@mui/icons-material';
import Link from 'next/link';
import { useRef } from 'react';

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportUSDM = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          // Store the imported data and navigate to editor
          localStorage.setItem('importedUSDM', JSON.stringify(jsonData));
          window.location.href = '/editor?source=import';
        } catch (error) {
          alert('Invalid JSON file. Please select a valid USDM JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLoadExample = async () => {
    try {
      const response = await fetch('/Example/CDISC_Pilot_Study.json');
      const exampleData = await response.json();
      // Store the example data and navigate to editor
      localStorage.setItem('importedUSDM', JSON.stringify(exampleData));
      window.location.href = '/editor?source=example';
    } catch (error) {
      alert('Failed to load example file. Please try again.');
    }
  };
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Visual USDM Editor
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          align="center"
          color="textSecondary"
        >
          Creating a Visual USDM Editor for Clinical Trials
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FileOpen sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="h3">
                    Visual Editor
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ flexGrow: 1, mb: 2 }}
                >
                  Import your existing USDM JSON files and edit them with an
                  intuitive visual interface. Upload your files to get started
                  with the visual editor.
                </Typography>
                <Box>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".json"
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<FileOpen />}
                    onClick={handleImportUSDM}
                  >
                    Import USDM File
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CloudDownload sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="h3">
                    Load Example USDM
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ flexGrow: 1, mb: 2 }}
                >
                  Explore the editor with the CDISC Pilot Study example. Load
                  the example USDM file to see how the visual editor works.
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CloudDownload />}
                    onClick={handleLoadExample}
                  >
                    Load Example
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Info sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="h3">
                    Learn More
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ flexGrow: 1, mb: 2 }}
                >
                  Discover the capabilities of the Visual USDM Editor and learn
                  about CDISC USDM standards for clinical trial documentation.
                </Typography>
                <Box>
                  <Link href="/about" passHref>
                    <Button variant="outlined" fullWidth startIcon={<Info />}>
                      About USDM
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 4, mt: 6, backgroundColor: 'grey.50' }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            What is USDM?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The Unified Study Definition Model (USDM) is a CDISC standard that
            provides a structured way to define clinical studies. It enables the
            standardization of study design elements and facilitates better
            communication between stakeholders in clinical research.
          </Typography>
          <Typography variant="body1">
            This Visual USDM Editor makes it easier to create, edit, and
            visualize USDM documents through an intuitive graphical interface,
            reducing the complexity of working with raw JSON files.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
