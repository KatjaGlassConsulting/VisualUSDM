'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Paper,
  Link,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import NextLink from 'next/link';

export default function AboutPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <NextLink href="/" passHref>
            <Button startIcon={<ArrowBack />} sx={{ mr: 2 }}>
              Back to Home
            </Button>
          </NextLink>
          <Typography variant="h3" component="h1">
            About Visual USDM Editor
          </Typography>
        </Box>
        
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            What is USDM?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            The Unified Study Definition Model (USDM) is a CDISC (Clinical Data Interchange Standards Consortium) 
            standard that provides a comprehensive framework for defining clinical studies. It serves as a common 
            language for describing study designs, activities, and data collection procedures across different 
            systems and organizations.
          </Typography>
          
          <Typography variant="h5" component="h3" gutterBottom>
            Key Benefits of USDM:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Standardization" 
                secondary="Provides a consistent way to describe clinical studies across different platforms and organizations"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Interoperability" 
                secondary="Enables seamless data exchange between different clinical trial management systems"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Efficiency" 
                secondary="Reduces time and effort in study setup and management through standardized definitions"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Quality" 
                secondary="Improves data quality and consistency through structured study definitions"
              />
            </ListItem>
          </List>
        </Paper>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
              About This Editor
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              The Visual USDM Editor is designed to make working with USDM documents more accessible and intuitive. 
              Instead of manually editing complex JSON files, users can leverage a visual interface to create, 
              modify, and validate their clinical study definitions.
            </Typography>
            
            <Typography variant="h5" component="h3" gutterBottom>
              Features:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip label="Visual JSON Editor" color="primary" />
              <Chip label="Schema Validation" color="primary" />
              <Chip label="CDISC Compliance" color="primary" />
              <Chip label="Import/Export" color="primary" />
              <Chip label="Real-time Preview" color="primary" />
              <Chip label="Example Templates" color="primary" />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
              Technology Stack
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              This application is built using modern web technologies:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Next.js 15" 
                  secondary="Modern React framework with App Router for server-side rendering and optimal performance"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="React 18" 
                  secondary="Latest UI library with concurrent features and improved performance"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Material-UI (MUI) v6" 
                  secondary="Latest comprehensive React component library following Material Design 3"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="TypeScript 5" 
                  secondary="Latest type-safe JavaScript for better development experience"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Resources
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Learn more about USDM and CDISC standards:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary={
                  <Link href="https://www.cdisc.org/" target="_blank" rel="noopener noreferrer">
                    CDISC Official Website
                  </Link>
                }
                secondary="The Clinical Data Interchange Standards Consortium main website"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary={
                  <Link href="https://github.com/cdisc-org/DDF-RA" target="_blank" rel="noopener noreferrer">
                    CDISC DDF Repository
                  </Link>
                }
                secondary="Official repository containing USDM examples and documentation"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Example Files"
                secondary="Check the Example/ folder in this repository for sample USDM documents"
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Container>
  );
}
