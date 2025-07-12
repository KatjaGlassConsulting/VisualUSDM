'use client';

import { useState, useEffect } from 'react';
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
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { 
  Download, 
  ArrowBack, 
  Fullscreen, 
  FullscreenExit,
  Visibility,
  Edit,
  Add,
  Remove,
  ExpandMore,
} from '@mui/icons-material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Helper function to safely parse JSON
const safeParseJSON = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

// Helper function to convert date to yyyy-mm-dd format
const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  
  // If already in yyyy-mm-dd format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Try to parse and convert to yyyy-mm-dd
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]; // Returns yyyy-mm-dd
    }
  } catch {
    // If parsing fails, return empty string
  }
  
  return '';
};

export default function EditorPage() {
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [parsedUSDM, setParsedUSDM] = useState<any>(null);
  const [displayValues, setDisplayValues] = useState<any>({}); // For immediate UI updates
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(0); // Track selected version
  const [selectedAmendmentIndex, setSelectedAmendmentIndex] = useState<number>(0); // Track selected amendment
  const [selectedStudyDesignIndex, setSelectedStudyDesignIndex] = useState<number>(0); // Track selected study design
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();

  // Update parsed USDM whenever JSON content changes
  useEffect(() => {
    if (jsonContent.trim()) {
      const parsed = safeParseJSON(jsonContent);
      setParsedUSDM(parsed);
      setDisplayValues(parsed || {}); // Sync display values with parsed data
      
      // Set selected version to the last one
      if (parsed?.study?.versions?.length > 0) {
        setSelectedVersionIndex(parsed.study.versions.length - 1);
        
        // Set selected amendment to the last one if amendments exist
        if (parsed.study.versions[parsed.study.versions.length - 1]?.amendments?.length > 0) {
          setSelectedAmendmentIndex(parsed.study.versions[parsed.study.versions.length - 1].amendments.length - 1);
        }
        
        // Set selected study design to the last one if study designs exist
        if (parsed.study.versions[parsed.study.versions.length - 1]?.studyDesigns?.length > 0) {
          setSelectedStudyDesignIndex(parsed.study.versions[parsed.study.versions.length - 1].studyDesigns.length - 1);
        }
      }
    } else {
      setParsedUSDM(null);
      setDisplayValues({});
      setSelectedVersionIndex(0);
      setSelectedAmendmentIndex(0);
      setSelectedStudyDesignIndex(0);
    }
  }, [jsonContent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
    };
  }, [updateTimeout]);

  useEffect(() => {
    const source = searchParams?.get('source');
    if (source === 'import' || source === 'example') {
      const importedData = localStorage.getItem('importedUSDM');
      if (importedData) {
        try {
          const parsedData = JSON.parse(importedData);
          setJsonContent(JSON.stringify(parsedData, null, 2));
          setLoadingStatus(source === 'import' ? 'Imported USDM file loaded successfully!' : 'Example USDM file loaded successfully!');
          setError(null);
          // Clean up localStorage after loading
          localStorage.removeItem('importedUSDM');
        } catch (err) {
          setError('Failed to load imported data');
        }
      }
    }
  }, [searchParams]);

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

  // Handle form field updates with debouncing
  const updateUSDMField = (path: (string | number)[], value: any) => {
    if (!parsedUSDM) return;
    
    // Immediately update display values for responsive UI
    const immediateUpdate = { ...displayValues };
    let current = immediateUpdate;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setDisplayValues(immediateUpdate);
    
    // Clear existing timeout
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    
    // Set new timeout for debounced update to actual data and JSON
    const timeout = setTimeout(() => {
      const updated = { ...parsedUSDM };
      let current = updated;
      
      // Navigate to the parent object
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      
      // Set the value
      current[path[path.length - 1]] = value;
      
      // Update both parsed data and JSON string
      setParsedUSDM(updated);
      setJsonContent(JSON.stringify(updated, null, 2));
    }, 2000); // 2 second delay
    
    setUpdateTimeout(timeout);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleExport = () => {
    if (!error && jsonContent.trim()) {
      try {
        // Parse and re-stringify to ensure beautiful formatting
        const parsedJson = JSON.parse(jsonContent);
        const beautifiedJson = JSON.stringify(parsedJson, null, 2);
        
        const blob = new Blob([beautifiedJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'usdm-document.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        setError('Cannot export invalid JSON');
      }
    }
  };

  return (
    <Container maxWidth={isFullscreen ? false : "xl"} sx={{ px: isFullscreen ? 1 : 3 }}>
      <Box sx={{ py: isFullscreen ? 2 : 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" passHref>
              <Button startIcon={<ArrowBack />} sx={{ mr: 2 }}>
                Back to Home
              </Button>
            </Link>
            <Typography variant="h3" component="h1">
              USDM Editor
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Editor"}>
              <IconButton onClick={toggleFullscreen} size="large">
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              onClick={handleExport}
              disabled={!!error || !jsonContent.trim()}
              startIcon={<Download />}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Success/Error Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loadingStatus && (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            onClose={() => setLoadingStatus('')}
          >
            {loadingStatus}
          </Alert>
        )}

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Visual Editor - Main Content */}
          <Grid item xs={12} lg={isFullscreen ? 12 : 8}>
            <Card sx={{ height: isFullscreen ? 'calc(100vh - 200px)' : '600px' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Visual Editor
                </Typography>
                
                {parsedUSDM ? (
                  <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {/* USDM Metadata */}
                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6">USDM Metadata</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="USDM Version"
                              value={displayValues.usdmVersion || ''}
                              onChange={(e) => updateUSDMField(['usdmVersion'], e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="System Name"
                              value={displayValues.systemName || ''}
                              onChange={(e) => updateUSDMField(['systemName'], e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="System Version"
                              value={displayValues.systemVersion || ''}
                              onChange={(e) => updateUSDMField(['systemVersion'], e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    {/* Study Information */}
                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6">Study Information</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Study Name"
                              value={displayValues.study?.name || ''}
                              onChange={(e) => updateUSDMField(['study', 'name'], e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              label="Study Description"
                              value={displayValues.study?.description || ''}
                              onChange={(e) => updateUSDMField(['study', 'description'], e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Study ID"
                              value={displayValues.study?.id || ''}
                              onChange={(e) => updateUSDMField(['study', 'id'], e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Study Label"
                              value={displayValues.study?.label || ''}
                              onChange={(e) => updateUSDMField(['study', 'label'], e.target.value)}
                            />
                          </Grid>
                        </Grid>
                        <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Content</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {/* Titles */}
                                {displayValues.study.versions[selectedVersionIndex].titles?.map((title: any, titleIndex: number) => (
                                  <TableRow key={`title-${titleIndex}`}>
                                    <TableCell>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        Titles - {title?.type?.decode || 'Title'}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        size="small"
                                        fullWidth
                                        value={title?.text || ''}
                                        onChange={(e) => {
                                          const newValue = e.target.value;
                                          if (updateTimeout) {
                                            clearTimeout(updateTimeout);
                                          }
                                          
                                          // Update display values immediately
                                          setDisplayValues((prev: any) => {
                                            const updated = { ...prev };
                                            if (updated.study?.versions?.[selectedVersionIndex]?.titles?.[titleIndex]) {
                                              updated.study.versions[selectedVersionIndex].titles[titleIndex].text = newValue;
                                            }
                                            return updated;
                                          });
                                          
                                          // Debounce the actual update
                                          const timeout = setTimeout(() => {
                                            updateUSDMField(['study', 'versions', selectedVersionIndex, 'titles', titleIndex, 'text'], newValue);
                                          }, 2000);
                                          setUpdateTimeout(timeout);
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}

                                {/* Business Therapeutic Areas */}
                                {displayValues.study.versions[selectedVersionIndex].businessTherapeuticAreas?.map((area: any, areaIndex: number) => (
                                  <TableRow key={`business-ta-${areaIndex}`}>
                                    <TableCell>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        Business TA
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2">
                                        {area?.decode || 'No decode available'}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}

                                {/* Study Identifiers */}
                                {displayValues.study.versions[selectedVersionIndex].studyIdentifiers?.map((identifier: any, identifierIndex: number) => (
                                  <TableRow key={`study-id-${identifierIndex}`}>
                                    <TableCell>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        ID - {identifier?.instanceType || 'Identifier'}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        size="small"
                                        fullWidth
                                        value={identifier?.text || ''}
                                        onChange={(e) => {
                                          const newValue = e.target.value;
                                          if (updateTimeout) {
                                            clearTimeout(updateTimeout);
                                          }
                                          
                                          // Update display values immediately
                                          setDisplayValues((prev: any) => {
                                            const updated = { ...prev };
                                            if (updated.study?.versions?.[selectedVersionIndex]?.studyIdentifiers?.[identifierIndex]) {
                                              updated.study.versions[selectedVersionIndex].studyIdentifiers[identifierIndex].text = newValue;
                                            }
                                            return updated;
                                          });
                                          
                                          // Debounce the actual update
                                          const timeout = setTimeout(() => {
                                            updateUSDMField(['study', 'versions', selectedVersionIndex, 'studyIdentifiers', identifierIndex, 'text'], newValue);
                                          }, 2000);
                                          setUpdateTimeout(timeout);
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}

                                {/* Reference Identifiers */}
                                {displayValues.study.versions[selectedVersionIndex].referenceIdentifiers?.map((reference: any, referenceIndex: number) => (
                                  <TableRow key={`reference-id-${referenceIndex}`}>
                                    <TableCell>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        ID - {reference?.instanceType || 'Reference'}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        size="small"
                                        fullWidth
                                        value={(() => {
                                          const typeDecode = reference?.type?.decode || '';
                                          const text = reference?.text || '';
                                          return typeDecode ? `${typeDecode} ${text}` : text;
                                        })()}
                                        onChange={(e) => {
                                          const newValue = e.target.value;
                                          const typeDecode = reference?.type?.decode || '';
                                          // Extract just the text part by removing the type decode prefix
                                          const textValue = typeDecode && newValue.startsWith(typeDecode) 
                                            ? newValue.substring(typeDecode.length).trim() 
                                            : newValue;
                                          
                                          if (updateTimeout) {
                                            clearTimeout(updateTimeout);
                                          }
                                          
                                          // Update display values immediately
                                          setDisplayValues((prev: any) => {
                                            const updated = { ...prev };
                                            if (updated.study?.versions?.[selectedVersionIndex]?.referenceIdentifiers?.[referenceIndex]) {
                                              updated.study.versions[selectedVersionIndex].referenceIdentifiers[referenceIndex].text = textValue;
                                            }
                                            return updated;
                                          });
                                          
                                          // Debounce the actual update
                                          const timeout = setTimeout(() => {
                                            updateUSDMField(['study', 'versions', selectedVersionIndex, 'referenceIdentifiers', referenceIndex, 'text'], textValue);
                                          }, 2000);
                                          setUpdateTimeout(timeout);
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                      </AccordionDetails>
                    </Accordion>

                    {/* Study Versions */}
                    {displayValues.study?.versions && displayValues.study.versions.length > 0 && (
                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="h6">
                            Study Versions
                            {displayValues.study.versions[selectedVersionIndex] && (
                              <Chip 
                                label={displayValues.study.versions[selectedVersionIndex].id || `Version ${selectedVersionIndex + 1}`}
                                size="small" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={3}>
                            {/* Version Selector */}
                            <FormControl fullWidth>
                              <InputLabel>Select Study Version</InputLabel>
                              <Select
                                value={selectedVersionIndex}
                                label="Select Study Version"
                                onChange={(e) => setSelectedVersionIndex(Number(e.target.value))}
                              >
                                {displayValues.study.versions.map((version: any, index: number) => (
                                  <MenuItem key={index} value={index}>
                                    {version.id || `Version ${index + 1}`}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Selected Version Details */}
                            {displayValues.study.versions[selectedVersionIndex] && (
                              <Paper sx={{ p: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Version Details: {displayValues.study.versions[selectedVersionIndex].id}
                                </Typography>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      fullWidth
                                      label="Version Identifier"
                                      value={displayValues.study.versions[selectedVersionIndex].versionIdentifier || ''}
                                      onChange={(e) => updateUSDMField(['study', 'versions', selectedVersionIndex, 'versionIdentifier'], e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      fullWidth
                                      label="Version ID"
                                      value={displayValues.study.versions[selectedVersionIndex].id || ''}
                                      onChange={(e) => updateUSDMField(['study', 'versions', selectedVersionIndex, 'id'], e.target.value)}
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          backgroundColor: 'grey.50',
                                        },
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      multiline
                                      rows={4}
                                      label="Rationale"
                                      value={displayValues.study.versions[selectedVersionIndex].rationale || ''}
                                      onChange={(e) => updateUSDMField(['study', 'versions', selectedVersionIndex, 'rationale'], e.target.value)}
                                    />
                                  </Grid>

                                  {/* Dates Table */}
                                  {displayValues.study.versions[selectedVersionIndex].dateValues && 
                                   displayValues.study.versions[selectedVersionIndex].dateValues.length > 0 && (
                                    <Grid item xs={12}>
                                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                        Dates
                                      </Typography>
                                      <TableContainer component={Paper} sx={{ mt: 1 }}>
                                        <Table>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell>Label</TableCell>
                                              <TableCell>Date Value</TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {displayValues.study.versions[selectedVersionIndex].dateValues.map((dateValue: any, dateIndex: number) => (
                                              <TableRow key={dateIndex}>
                                                <TableCell>
                                                  <Typography variant="body2">
                                                    {dateValue.label || dateValue.name || `Date ${dateIndex + 1}`}
                                                  </Typography>
                                                </TableCell>
                                                <TableCell>
                                                  <TextField
                                                    fullWidth
                                                    type="date"
                                                    value={formatDateForInput(dateValue.dateValue || '')}
                                                    onChange={(e) => updateUSDMField(['study', 'versions', selectedVersionIndex, 'dateValues', dateIndex, 'dateValue'], e.target.value)}
                                                    size="small"
                                                    placeholder="yyyy-mm-dd"
                                                    InputLabelProps={{
                                                      shrink: true,
                                                    }}
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                    </Grid>
                                  )}
                                </Grid>
                              </Paper>
                            )}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    )}

                    {/* Amendments */}
                    {displayValues.study?.versions?.[selectedVersionIndex]?.amendments && 
                     displayValues.study.versions[selectedVersionIndex].amendments.length > 0 && (
                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="h6">
                            Amendments
                            {displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex] && (
                              <Chip 
                                label={displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].id || `Amendment ${selectedAmendmentIndex + 1}`}
                                size="small" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={3}>
                            {/* Amendment Selector */}
                            <FormControl fullWidth>
                              <InputLabel>Select Amendment</InputLabel>
                              <Select
                                value={selectedAmendmentIndex}
                                label="Select Amendment"
                                onChange={(e) => setSelectedAmendmentIndex(Number(e.target.value))}
                              >
                                {displayValues.study.versions[selectedVersionIndex].amendments.map((amendment: any, index: number) => (
                                  <MenuItem key={index} value={index}>
                                    {amendment.id || `Amendment ${index + 1}`}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Selected Amendment Details */}
                            {displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex] && (
                              <Paper sx={{ p: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Amendment Details: {displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].id}
                                </Typography>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      fullWidth
                                      label="Amendment ID"
                                      value={displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].id || ''}
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          backgroundColor: 'grey.50',
                                        },
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      fullWidth
                                      label="Number"
                                      value={displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].number || ''}
                                      onChange={(e) => updateUSDMField(['study', 'versions', selectedVersionIndex, 'amendments', selectedAmendmentIndex, 'number'], e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      fullWidth
                                      label="Summary"
                                      value={displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].summary || ''}
                                      onChange={(e) => updateUSDMField(['study', 'versions', selectedVersionIndex, 'amendments', selectedAmendmentIndex, 'summary'], e.target.value)}
                                    />
                                  </Grid>

                                  {/* Amendments Table */}
                                  <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                      Amendments
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ mt: 1 }}>
                                      <Table>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Content</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {/* Primary Reason */}
                                          {displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].primaryReason && (
                                            <TableRow>
                                              <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                  Primary Reason
                                                </Typography>
                                              </TableCell>
                                              <TableCell>
                                                <Typography variant="body2">
                                                  {(() => {
                                                    const primaryReason = displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].primaryReason;
                                                    const decode = primaryReason?.code?.decode || '';
                                                    const otherReason = primaryReason?.otherReason;
                                                    return decode + (otherReason ? ` - ${otherReason}` : '');
                                                  })()}
                                                </Typography>
                                              </TableCell>
                                            </TableRow>
                                          )}
                                          
                                          {/* Secondary Reasons */}
                                          {displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].secondaryReasons?.map((secondaryReason: any, reasonIndex: number) => (
                                            <TableRow key={reasonIndex}>
                                              <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                  Secondary Reason
                                                </Typography>
                                              </TableCell>
                                              <TableCell>
                                                <Typography variant="body2">
                                                  {(() => {
                                                    const decode = secondaryReason?.code?.decode || '';
                                                    const otherReason = secondaryReason?.otherReason;
                                                    return decode + (otherReason ? ` - ${otherReason}` : '');
                                                  })()}
                                                </Typography>
                                              </TableCell>
                                            </TableRow>
                                          ))}

                                          {/* Changes */}
                                          {displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].changes?.map((change: any, changeIndex: number) => (
                                            <TableRow key={`change-${changeIndex}`}>
                                              <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                  {change?.instanceType || 'Change'}
                                                </Typography>
                                              </TableCell>
                                              <TableCell>
                                                <Typography variant="body2">
                                                  {(() => {
                                                    const summary = change?.summary || '';
                                                    const rationale = change?.rationale || '';
                                                    const sections = change?.changedSections?.map((section: any) => section?.sectionTitle).filter(Boolean).join(', ') || '';
                                                    
                                                    let content = '';
                                                    if (summary) content += summary;
                                                    if (rationale) content += (content ? ' - ' : '') + rationale;
                                                    if (sections) content += (content ? ' - ' : '') + `Section: ${sections}`;
                                                    
                                                    return content || 'No details available';
                                                  })()}
                                                </Typography>
                                              </TableCell>
                                            </TableRow>
                                          ))}

                                          {/* Impacts */}
                                          {displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].impacts?.map((impact: any, impactIndex: number) => (
                                            <TableRow key={`impact-${impactIndex}`}>
                                              <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                  Impact
                                                </Typography>
                                              </TableCell>
                                              <TableCell>
                                                <Typography variant="body2">
                                                  {(() => {
                                                    const decode = impact?.type?.decode || '';
                                                    const text = impact?.text || '';
                                                    return decode + (text ? ` (${text})` : '');
                                                  })()}
                                                </Typography>
                                              </TableCell>
                                            </TableRow>
                                          ))}

                                          {/* Geographic Scopes */}
                                          {displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].geographicScopes?.map((scope: any, scopeIndex: number) => (
                                            <TableRow key={`scope-${scopeIndex}`}>
                                              <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                  Geographic Scope
                                                </Typography>
                                              </TableCell>
                                              <TableCell>
                                                <Typography variant="body2">
                                                  {(() => {
                                                    const decode = scope?.type?.decode || '';
                                                    const text = scope?.text || '';
                                                    return decode + (text ? ` (${text})` : '');
                                                  })()}
                                                </Typography>
                                              </TableCell>
                                            </TableRow>
                                          ))}

                                          {/* Enrollments */}
                                          {displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].enrollments?.map((enrollment: any, enrollmentIndex: number) => (
                                            <TableRow key={`enrollment-${enrollmentIndex}`}>
                                              <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                  {(() => {
                                                    const instanceType = enrollment?.instanceType || '';
                                                    const label = enrollment?.label;
                                                    const name = enrollment?.name;
                                                    
                                                    let type = instanceType;
                                                    if (label) {
                                                      type += ` ${label}`;
                                                    } else if (name) {
                                                      type += ` ${name}`;
                                                    }
                                                    
                                                    return type || 'Enrollment';
                                                  })()}
                                                </Typography>
                                              </TableCell>
                                              <TableCell>
                                                <TextField
                                                  type="number"
                                                  size="small"
                                                  value={enrollment?.quantity?.value || ''}
                                                  onChange={(e) => {
                                                    const newValue = parseInt(e.target.value) || 0;
                                                    if (updateTimeout) {
                                                      clearTimeout(updateTimeout);
                                                    }
                                                    
                                                    // Update display values immediately
                                                    setDisplayValues((prev: any) => {
                                                      const updated = { ...prev };
                                                      if (updated.study?.versions?.[selectedVersionIndex]?.amendments?.[selectedAmendmentIndex]?.enrollments?.[enrollmentIndex]?.quantity) {
                                                        updated.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].enrollments[enrollmentIndex].quantity.value = newValue;
                                                      }
                                                      return updated;
                                                    });
                                                    
                                                    // Debounce the actual update
                                                    const timeout = setTimeout(() => {
                                                      updateUSDMField(['study', 'versions', selectedVersionIndex, 'amendments', selectedAmendmentIndex, 'enrollments', enrollmentIndex, 'quantity', 'value'], newValue);
                                                    }, 2000);
                                                    setUpdateTimeout(timeout);
                                                  }}
                                                  sx={{ width: '120px' }}
                                                  inputProps={{ min: 0 }}
                                                />
                                              </TableCell>
                                            </TableRow>
                                          ))}

                                          {/* Date Values */}
                                          {displayValues.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].dateValues?.map((dateValue: any, dateIndex: number) => (
                                            <TableRow key={`date-${dateIndex}`}>
                                              <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                  {dateValue?.type?.decode || 'Date'}
                                                </Typography>
                                              </TableCell>
                                              <TableCell>
                                                <TextField
                                                  type="date"
                                                  size="small"
                                                  value={dateValue?.dateValue || ''}
                                                  onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    if (updateTimeout) {
                                                      clearTimeout(updateTimeout);
                                                    }
                                                    
                                                    // Update display values immediately
                                                    setDisplayValues((prev: any) => {
                                                      const updated = { ...prev };
                                                      if (updated.study?.versions?.[selectedVersionIndex]?.amendments?.[selectedAmendmentIndex]?.dateValues?.[dateIndex]) {
                                                        updated.study.versions[selectedVersionIndex].amendments[selectedAmendmentIndex].dateValues[dateIndex].dateValue = newValue;
                                                      }
                                                      return updated;
                                                    });
                                                    
                                                    // Debounce the actual update
                                                    const timeout = setTimeout(() => {
                                                      updateUSDMField(['study', 'versions', selectedVersionIndex, 'amendments', selectedAmendmentIndex, 'dateValues', dateIndex, 'dateValue'], newValue);
                                                    }, 2000);
                                                    setUpdateTimeout(timeout);
                                                  }}
                                                  sx={{ width: '180px' }}
                                                  InputLabelProps={{
                                                    shrink: true,
                                                  }}
                                                />
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </Grid>
                                </Grid>
                              </Paper>
                            )}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    )}   

                    {/* Study Design */}
                    {displayValues.study?.versions?.[selectedVersionIndex]?.studyDesigns && displayValues.study.versions[selectedVersionIndex].studyDesigns.length > 0 && (
                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="h6">
                            Study Design
                            {displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex] && (
                              <Chip 
                                label={displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex].id || `Design ${selectedStudyDesignIndex + 1}`}
                                size="small" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={3}>
                            {/* Study Design Selector */}
                            <FormControl fullWidth>
                              <InputLabel>Select Study Design</InputLabel>
                              <Select
                                value={selectedStudyDesignIndex}
                                label="Select Study Design"
                                onChange={(e) => setSelectedStudyDesignIndex(Number(e.target.value))}
                              >
                                {displayValues.study.versions[selectedVersionIndex].studyDesigns.map((design: any, index: number) => (
                                  <MenuItem key={index} value={index}>
                                    {design.id || `Design ${index + 1}`}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Study Design Fields */}
                            {displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex] && (
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="Name"
                                    value={displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex].name || ''}
                                    onChange={(e) => updateUSDMField(['study', 'versions', selectedVersionIndex, 'studyDesigns', selectedStudyDesignIndex, 'name'], e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="Label"
                                    value={displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex].label || ''}
                                    onChange={(e) => updateUSDMField(['study', 'versions', selectedVersionIndex, 'studyDesigns', selectedStudyDesignIndex, 'label'], e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    value={displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex].description || ''}
                                    onChange={(e) => updateUSDMField(['study', 'versions', selectedVersionIndex, 'studyDesigns', selectedStudyDesignIndex, 'description'], e.target.value)}
                                  />
                                </Grid>

                                {/* Study Design Details Table */}
                                <Grid item xs={12}>
                                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                          <TableCell sx={{ fontWeight: 'bold' }}>Content</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {/* Study Type */}
                                        {displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex].studyType && (
                                          <TableRow>
                                            <TableCell>
                                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                Study Type
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Typography variant="body2">
                                                {displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex].studyType?.decode || 'No decode available'}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        )}

                                        {/* Study Phase */}
                                        {displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex].studyPhase && (
                                          <TableRow>
                                            <TableCell>
                                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                Study Phase
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Typography variant="body2">
                                                {displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex].studyPhase?.standardCode?.decode || 'No decode available'}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        )}

                                        {/* Therapeutic Areas */}
                                        {displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex].therapeuticAreas?.map((area: any, areaIndex: number) => (
                                          <TableRow key={`therapeutic-area-${areaIndex}`}>
                                            <TableCell>
                                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                Therapeutic Areas
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Typography variant="body2">
                                                {area?.decode || 'No decode available'}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        ))}

                                        {/* Characteristics */}
                                        {displayValues.study.versions[selectedVersionIndex].studyDesigns[selectedStudyDesignIndex].characteristics?.map((characteristic: any, charIndex: number) => (
                                          <TableRow key={`characteristic-${charIndex}`}>
                                            <TableCell>
                                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                Characteristics
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Typography variant="body2">
                                                {characteristic?.decode || 'No decode available'}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </Grid>
                              </Grid>
                            )}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    )}                
                  </Box>
                ) : (
                  <Paper 
                    sx={{ 
                      flexGrow: 1,
                      p: 3,
                      backgroundColor: 'grey.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: 'grey.300'
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Edit sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        No USDM Data Loaded
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Import a USDM JSON file or load an example to start editing.
                        <br />
                        The visual editor will show form fields for easy editing.
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* JSON Viewer & Quick Actions - Side Panel */}
          {!isFullscreen && (
            <Grid item xs={12} lg={4}>
              {/* JSON Viewer */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    JSON Viewer
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={15}
                    variant="outlined"
                    placeholder="JSON content will be displayed here..."
                    value={jsonContent}
                    onChange={handleJsonChange}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'monospace',
                        fontSize: '12px',
                      },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    sx={{ mb: 2 }}
                    disabled
                  >
                    Placeholder Action 1
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    sx={{ mb: 2 }}
                    disabled
                  >
                    Placeholder Action 2
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    disabled
                  >
                    Placeholder Action 3
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
