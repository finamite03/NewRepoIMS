import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  Autocomplete,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
  FormHelperText,
  Switch,
  FormControlLabel,
  Card,
  CardMedia
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  AddPhotoAlternate as AddPhotoIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';

// Sample data - in a real app this would come from the backend
const categories = ['Electronics', 'Clothing', 'Home Goods', 'Sports', 'Office Supplies', 'Food'];
const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D'];
const suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D', 'Supplier E'];

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Product name is required'),
  sku: yup
    .string()
    .required('SKU code is required'),
  barcode: yup
    .string()
    .required('Barcode is required'),
  category: yup
    .string()
    .required('Category is required'),
  description: yup
    .string(),
  costPrice: yup
    .number()
    .positive('Cost price must be positive')
    .required('Cost price is required'),
  sellingPrice: yup
    .number()
    .positive('Selling price must be positive')
    .required('Selling price is required'),
  initialStock: yup
    .number()
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .required('Initial stock is required'),
  minStockLevel: yup
    .number()
    .integer('Min stock level must be a whole number')
    .min(0, 'Min stock level cannot be negative')
    .required('Min stock level is required'),
  warehouseId: yup
    .string()
    .required('Warehouse is required'),
  supplierId: yup
    .string()
    .required('Primary supplier is required'),
});

function AddEditSKU() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const isEdit = Boolean(id);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      sku: '',
      barcode: '',
      description: '',
      category: '',
      costPrice: '',
      sellingPrice: '',
      initialStock: '',
      minStockLevel: '',
      warehouseId: '',
      supplierId: '',
      isActive: true,
      alternateSuppliers: [],
      tags: [],
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // In a real app, you would use FormData if there's a file upload
        // const formData = new FormData();
        // Object.keys(values).forEach(key => {
        //   formData.append(key, values[key]);
        // });
        // if (imageFile) {
        //   formData.append('image', imageFile);
        // }

        // For demo purposes, we'll just log the values and simulate success
        console.log('Submitted values:', values);
        console.log('Image file:', imageFile);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success(`SKU successfully ${isEdit ? 'updated' : 'created'}!`);
        navigate('/skus');
      } catch (error) {
        console.error('Error saving SKU:', error);
        toast.error(`Failed to ${isEdit ? 'update' : 'create'} SKU. Please try again.`);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    // Fetch SKU data if in edit mode
    if (isEdit) {
      setInitialLoading(true);
      
      // In a real app, you would use:
      // const fetchSKUData = async () => {
      //   try {
      //     const response = await axios.get(`/api/skus/${id}`);
      //     formik.setValues({ ...response.data });
      //     if (response.data.imageUrl) {
      //       setImagePreview(response.data.imageUrl);
      //     }
      //   } catch (error) {
      //     setError('Failed to load SKU data. Please try again.');
      //   } finally {
      //     setInitialLoading(false);
      //   }
      // };
      // fetchSKUData();

      // For demo purposes, we'll simulate the response
      setTimeout(() => {
        const mockData = {
          name: 'Product Name',
          sku: `SKU${id}`,
          barcode: `100000${id}`,
          description: 'This is a sample product description that explains the features and benefits of the product.',
          category: 'Electronics',
          costPrice: '75.50',
          sellingPrice: '129.99',
          initialStock: '100',
          minStockLevel: '10',
          warehouseId: 'Warehouse A',
          supplierId: 'Supplier A',
          isActive: true,
          alternateSuppliers: ['Supplier B', 'Supplier C'],
          tags: ['Premium', 'New Arrival'],
          notes: 'Special handling required for this product.',
        };
        formik.setValues(mockData);
        setImagePreview(`https://source.unsplash.com/random/300x200?product&sig=${id}`);
        setInitialLoading(false);
      }, 1000);
    }
  }, [id, isEdit]);

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          {isEdit ? 'Edit SKU' : 'Add New SKU'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {isEdit 
            ? 'Update the details of an existing Stock Keeping Unit (SKU).' 
            : 'Create a new Stock Keeping Unit (SKU) in your inventory system.'}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Product Name"
                    variant="outlined"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="sku"
                    name="sku"
                    label="SKU Code"
                    variant="outlined"
                    value={formik.values.sku}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.sku && Boolean(formik.errors.sku)}
                    helperText={formik.touched.sku && formik.errors.sku}
                    disabled={isEdit} // SKU code shouldn't change for existing items
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="barcode"
                    name="barcode"
                    label="Barcode"
                    variant="outlined"
                    value={formik.values.barcode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.barcode && Boolean(formik.errors.barcode)}
                    helperText={formik.touched.barcode && formik.errors.barcode}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl 
                    fullWidth
                    error={formik.touched.category && Boolean(formik.errors.category)}
                  >
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <FormHelperText>{formik.errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="body2" gutterBottom>
                  Product Image
                </Typography>
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {imagePreview ? (
                    <>
                      <CardMedia
                        component="img"
                        image={imagePreview}
                        alt="Product Preview"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          position: 'absolute',
                        }}
                      />
                      <Button
                        variant="contained"
                        component="label"
                        sx={{
                          position: 'absolute',
                          bottom: 10,
                          right: 10,
                          zIndex: 2,
                        }}
                      >
                        Change Image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AddPhotoIcon />}
                      sx={{ my: 2 }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  )}
                </Card>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Recommended: 800x600px JPG, PNG or GIF
                </Typography>
              </Box>
            </Grid>
            
            {/* Pricing & Stock */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
                Pricing & Stock
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="costPrice"
                name="costPrice"
                label="Cost Price"
                type="number"
                variant="outlined"
                value={formik.values.costPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.costPrice && Boolean(formik.errors.costPrice)}
                helperText={formik.touched.costPrice && formik.errors.costPrice}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="sellingPrice"
                name="sellingPrice"
                label="Selling Price"
                type="number"
                variant="outlined"
                value={formik.values.sellingPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="initialStock"
                name="initialStock"
                label="Initial Stock"
                type="number"
                variant="outlined"
                value={formik.values.initialStock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.initialStock && Boolean(formik.errors.initialStock)}
                helperText={formik.touched.initialStock && formik.errors.initialStock}
                disabled={isEdit} // Can't change initial stock for existing items
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="minStockLevel"
                name="minStockLevel"
                label="Min Stock Level"
                type="number"
                variant="outlined"
                value={formik.values.minStockLevel}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.minStockLevel && Boolean(formik.errors.minStockLevel)}
                helperText={formik.touched.minStockLevel && formik.errors.minStockLevel}
              />
            </Grid>
            
            {/* Location and Supplier */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
                Location and Supplier
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth
                error={formik.touched.warehouseId && Boolean(formik.errors.warehouseId)}
              >
                <InputLabel id="warehouse-label">Warehouse</InputLabel>
                <Select
                  labelId="warehouse-label"
                  id="warehouseId"
                  name="warehouseId"
                  value={formik.values.warehouseId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Warehouse"
                >
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse} value={warehouse}>
                      {warehouse}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.warehouseId && formik.errors.warehouseId && (
                  <FormHelperText>{formik.errors.warehouseId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth
                error={formik.touched.supplierId && Boolean(formik.errors.supplierId)}
              >
                <InputLabel id="supplier-label">Primary Supplier</InputLabel>
                <Select
                  labelId="supplier-label"
                  id="supplierId"
                  name="supplierId"
                  value={formik.values.supplierId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Primary Supplier"
                >
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier} value={supplier}>
                      {supplier}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.supplierId && formik.errors.supplierId && (
                  <FormHelperText>{formik.errors.supplierId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="alt-suppliers-label">Alternate Suppliers</InputLabel>
                <Select
                  labelId="alt-suppliers-label"
                  id="alternateSuppliers"
                  name="alternateSuppliers"
                  multiple
                  value={formik.values.alternateSuppliers}
                  onChange={formik.handleChange}
                  input={<OutlinedInput id="select-alt-suppliers" label="Alternate Suppliers" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {suppliers
                    .filter(supplier => supplier !== formik.values.supplierId)
                    .map((supplier) => (
                      <MenuItem key={supplier} value={supplier}>
                        {supplier}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Additional Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
                Additional Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.isActive}
                    onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                    name="isActive"
                    color="primary"
                  />
                }
                label="Active Status"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Inactive SKUs won't appear in reports and can't be used in new transactions.
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="tags"
                options={['Premium', 'New Arrival', 'Sale', 'Best Seller', 'Seasonal', 'Limited Edition']}
                freeSolo
                value={formik.values.tags}
                onChange={(event, newValue) => {
                  formik.setFieldValue('tags', newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      variant="outlined" 
                      label={option} 
                      size="small" 
                      {...getTagProps({ index })} 
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    placeholder="Add tags"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Additional Notes"
                variant="outlined"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            
            {/* Form Actions */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/skus')}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {loading ? 'Saving...' : `${isEdit ? 'Update' : 'Create'} SKU`}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddEditSKU;