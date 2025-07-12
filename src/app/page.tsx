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
import { Edit, FileOpen, Info } from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Visual USDM Editor
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="textSecondary">
          Creating a Visual USDM Editor for Clinical Trials
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Edit sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="h3">
                    Visual Editor
                  </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary">
                  Create and edit USDM documents with an intuitive visual interface.
                  Drag and drop components, edit properties, and see real-time updates.
                </Typography>
                <Link href="/editor" passHref>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    startIcon={<Edit />}
                  >
                    Open Editor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FileOpen sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="h3">
                    Import & Export
                  </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary">
                  Import existing USDM JSON files and export your work in various formats.
                  Full compatibility with CDISC DDF standards.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  startIcon={<FileOpen />}
                >
                  Browse Files
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Info sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="h3">
                    Learn More
                  </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary">
                  Discover the capabilities of the Visual USDM Editor and learn about
                  CDISC USDM standards for clinical trial documentation.
                </Typography>
                <Link href="/about" passHref>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    startIcon={<Info />}
                  >
                    About USDM
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 4, mt: 6, backgroundColor: 'grey.50' }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            What is USDM?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The Unified Study Definition Model (USDM) is a CDISC standard that provides a structured
            way to define clinical studies. It enables the standardization of study design elements
            and facilitates better communication between stakeholders in clinical research.
          </Typography>
          <Typography variant="body1">
            This Visual USDM Editor makes it easier to create, edit, and visualize USDM documents
            through an intuitive graphical interface, reducing the complexity of working with raw JSON files.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
