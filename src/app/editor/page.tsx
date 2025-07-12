'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Container,
  Paper,
  TextField,
  Alert,
} from '@mui/material';
import { Save, Upload, Download, Visibility, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export default function EditorPage() {
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setJsonContent(value);
    
    try {
      if (value.trim()) {
        JSON.parse(value);
        setError(null);
      }
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handleLoadExample = () => {
    // This would load the example CDISC file
    setJsonContent(JSON.stringify({
      "study": {
        "id": "CDISC_PILOT_STUDY",
        "name": "CDISC Pilot Study",
        "description": "Example USDM study definition"
      },
      "activities": [],
      "encounters": [],
      "biomedicalConcepts": []
    }, null, 2));
    setError(null);
  };

  const handleSave = () => {
    if (!error && jsonContent.trim()) {
      // Implementation for saving
      console.log('Saving USDM document...');
    }
  };

  const handleExport = () => {
    if (!error && jsonContent.trim()) {
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usdm-document.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Link href="/" passHref>
            <Button startIcon={<ArrowBack />} sx={{ mr: 2 }}>
              Back to Home
            </Button>
          </Link>
          <Typography variant="h3" component="h1">
            USDM Editor
          </Typography>
        </Box>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Create and edit USDM documents using the JSON editor below. Use the visual tools
          to validate and structure your clinical study definitions.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="h2">
                    JSON Editor
                  </Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      onClick={handleLoadExample}
                      sx={{ mr: 1 }}
                      startIcon={<Upload />}
                    >
                      Load Example
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={!!error || !jsonContent.trim()}
                      sx={{ mr: 1 }}
                      startIcon={<Save />}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleExport}
                      disabled={!!error || !jsonContent.trim()}
                      startIcon={<Download />}
                    >
                      Export
                    </Button>
                  </Box>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  variant="outlined"
                  placeholder="Enter your USDM JSON content here..."
                  value={jsonContent}
                  onChange={handleJsonChange}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '14px',
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Visual Preview
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  A visual representation of your USDM document will appear here.
                </Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    minHeight: 200, 
                    backgroundColor: 'grey.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Visibility sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      Visual preview will be displayed here
                    </Typography>
                  </Box>
                </Paper>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Quick Actions
                </Typography>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  sx={{ mb: 2 }}
                  onClick={handleLoadExample}
                >
                  Load CDISC Pilot Example
                </Button>
                <Button fullWidth variant="outlined" sx={{ mb: 2 }}>
                  Validate USDM Schema
                </Button>
                <Button fullWidth variant="outlined">
                  Generate Study Timeline
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
