import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Dialog, Portal, Checkbox, Divider, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const STORAGE_KEY = 'GST_RECORDS';

const CalculatorScreen = ({ navigation }) => {
  const [baseAmount, setBaseAmount] = useState('');
  const [gstRate, setGstRate] = useState('18'); // Default GST rate
  const [productName, setProductName] = useState('');
  const [calculationResults, setCalculationResults] = useState(null);
  const [error, setError] = useState('');
  const [saveDialogVisible, setSaveDialogVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [category, setCategory] = useState('General');
  const isFocused = useIsFocused();
  
  // Common GST rates in India
  const commonGSTRates = [0, 5, 12, 18, 28];
  
  // Categories for GST
  const commonCategories = [
    'General', 'Food', 'Electronics', 'Clothing', 
    'Services', 'Healthcare', 'Education', 'Other'
  ];
  
  useEffect(() => {
    // Reset fields when screen comes into focus
    if (isFocused) {
      if (!calculationResults) {
        setProductName('');
        setIsFavorite(false);
        setCategory('General');
      }
    }
  }, [isFocused]);

  const calculateGST = () => {
    // Reset previous error
    setError('');
    
    // Validate inputs
    if (!baseAmount || isNaN(parseFloat(baseAmount)) || parseFloat(baseAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!gstRate || isNaN(parseFloat(gstRate)) || parseFloat(gstRate) < 0 || parseFloat(gstRate) > 100) {
      setError('Please enter a valid GST rate (0-100)');
      return;
    }

    // Parse inputs
    const amount = parseFloat(baseAmount);
    const rate = parseFloat(gstRate);
    
    // Calculate GST
    const gstAmount = (amount * rate) / 100;
    const totalAmount = amount + gstAmount;
    
    // Set calculation results
    setCalculationResults({
      baseAmount: amount,
      gstRate: rate,
      gstAmount: gstAmount,
      totalAmount: totalAmount
    });
  };

  const handleSaveRecord = async () => {
    if (!productName.trim()) {
      Alert.alert("Error", "Please enter a product name");
      return;
    }

    try {
      // Get existing records
      const existingRecordsJson = await AsyncStorage.getItem(STORAGE_KEY);
      const existingRecords = existingRecordsJson ? JSON.parse(existingRecordsJson) : [];
      
      // Create new record
      const newRecord = {
        id: Date.now().toString(), // Simple unique ID
        date: new Date().toISOString(),
        productName: productName,
        baseAmount: calculationResults.baseAmount,
        gstRate: calculationResults.gstRate,
        gstAmount: calculationResults.gstAmount,
        totalAmount: calculationResults.totalAmount,
        category: category,
        isFavorite: isFavorite
      };
      
      console.log('Saving record:', newRecord);
      
      // Add new record to existing records
      const updatedRecords = [newRecord, ...existingRecords];
      
      // Save updated records
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
      console.log('All records after save:', updatedRecords);
      
      // Close dialog and reset form
      setSaveDialogVisible(false);
      setProductName('');
      setBaseAmount('');
      setCalculationResults(null);
      setIsFavorite(false);
      setCategory('General');
      
      // Show success message
      Alert.alert("Success", "Record saved successfully!", [
        { 
          text: 'View Records', 
          onPress: () => navigation.navigate('Records') 
        },
        { 
          text: 'OK', 
          style: 'cancel' 
        }
      ]);
    } catch (error) {
      console.error("Error saving record:", error);
      Alert.alert("Error", "Could not save record: " + error.message);
    }
  };

  const handleReset = () => {
    setBaseAmount('');
    setGstRate('18');
    setProductName('');
    setCalculationResults(null);
    setError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBanner}>
          <Text style={styles.title}>GST Calculator</Text>
          <Text style={styles.subtitle}>Calculate GST amounts for your products and services</Text>
        </View>
        
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>Enter Details</Title>
              <IconButton 
                icon="refresh" 
                size={24} 
                color={colors.primary} 
                onPress={handleReset}
                style={styles.resetButton} 
              />
            </View>
            
            <TextInput
              label="Product/Service Name"
              value={productName}
              onChangeText={setProductName}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="package-variant" color={colors.primary} />}
            />
            
            <TextInput
              label="Amount (without GST)"
              value={baseAmount}
              onChangeText={setBaseAmount}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="currency-inr" color={colors.primary} />}
            />
            
            <Text style={styles.rateLabel}>GST Rate (%)</Text>
            <View style={styles.ratesContainer}>
              {commonGSTRates.map(rate => (
                <TouchableOpacity
                  key={rate}
                  style={[
                    styles.rateButton, 
                    gstRate === rate.toString() && styles.selectedRateButton
                  ]}
                  onPress={() => setGstRate(rate.toString())}
                >
                  <Text 
                    style={[
                      styles.rateButtonText,
                      gstRate === rate.toString() && styles.selectedRateText
                    ]}
                  >
                    {rate}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.customRateContainer}>
              <Text style={styles.customRateLabel}>Custom Rate:</Text>
              <TextInput
                value={gstRate}
                onChangeText={setGstRate}
                keyboardType="numeric"
                style={styles.customRateInput}
                mode="outlined"
                right={<TextInput.Affix text="%" />}
              />
            </View>
            
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <Button 
              mode="contained" 
              onPress={calculateGST}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              icon="calculator"
            >
              Calculate GST
            </Button>
          </Card.Content>
        </Card>
        
        {calculationResults && (
          <Card style={styles.resultsCard}>
            <Card.Content>
              <Title style={styles.resultsTitle}>Calculation Results</Title>
              <Divider style={styles.divider} />
              
              <View style={styles.resultRow}>
                <Paragraph style={styles.resultLabel}>Base Amount:</Paragraph>
                <Paragraph style={styles.resultValue}>₹ {calculationResults.baseAmount.toFixed(2)}</Paragraph>
              </View>
              <View style={styles.resultRow}>
                <Paragraph style={styles.resultLabel}>GST Rate:</Paragraph>
                <Paragraph style={styles.resultValue}>{calculationResults.gstRate}%</Paragraph>
              </View>
              <View style={styles.resultRow}>
                <Paragraph style={styles.resultLabel}>GST Amount:</Paragraph>
                <Paragraph style={styles.resultValue}>₹ {calculationResults.gstAmount.toFixed(2)}</Paragraph>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.totalRow}>
                <Paragraph style={styles.totalLabel}>Total Amount:</Paragraph>
                <Paragraph style={styles.totalValue}>₹ {calculationResults.totalAmount.toFixed(2)}</Paragraph>
              </View>
              
              <TextInput
                label="Product Name"
                value={productName}
                onChangeText={text => setProductName(text)}
                style={styles.input}
                placeholder="Enter product name"
              />
              
              <Text style={styles.categoryLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                {commonCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryItem,
                      category === cat && styles.selectedCategory
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryText,
                      category === cat && styles.selectedCategoryText
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Button 
                mode="contained" 
                onPress={handleSaveRecord}
                style={styles.saveButton}
                icon="content-save"
                disabled={!calculationResults || !productName.trim()}
              >
                Save Record
              </Button>
            </Card.Content>
          </Card>
        )}
        
        {/* Save Record Dialog */}
        <Portal>
          <Dialog visible={saveDialogVisible} onDismiss={() => setSaveDialogVisible(false)} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>Save Tax Record</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Product/Service Name"
                value={productName}
                onChangeText={setProductName}
                style={styles.dialogInput}
                mode="outlined"
                left={<TextInput.Icon icon="package-variant" color={colors.primary} />}
              />
              
              <Text style={styles.categoryLabel}>Select Category:</Text>
              <View style={styles.categoriesContainer}>
                {commonCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      category === cat && styles.selectedCategoryButton
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text 
                      style={[
                        styles.categoryButtonText,
                        category === cat && styles.selectedCategoryText
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={isFavorite ? 'checked' : 'unchecked'}
                  onPress={() => setIsFavorite(!isFavorite)}
                  color={colors.primary}
                />
                <Text style={styles.checkboxLabel}>Mark as Favorite</Text>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button 
                onPress={() => setSaveDialogVisible(false)}
                style={styles.dialogButton}
              >
                Cancel
              </Button>
              <Button 
                mode="contained"
                onPress={handleSaveRecord}
                style={styles.dialogButton}
              >
                Save
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 0,
    paddingBottom: 30,
  },
  headerBanner: {
    backgroundColor: '#0d6efd',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  cardTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.medium,
    color: colors.primary,
  },
  resetButton: {
    margin: 0,
  },
  input: {
    marginBottom: spacing.medium,
    backgroundColor: colors.surface,
  },
  rateLabel: {
    fontSize: typography.fontSizes.medium,
    marginBottom: spacing.small,
    color: colors.text,
    fontWeight: typography.fontWeights.medium,
  },
  ratesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: spacing.medium,
    gap: 10,
  },
  rateButton: {
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  selectedRateButton: {
    backgroundColor: colors.primary,
  },
  rateButtonText: {
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
    fontSize: typography.fontSizes.medium,
  },
  selectedRateText: {
    color: colors.light,
  },
  customRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  customRateLabel: {
    marginRight: spacing.medium,
    fontSize: typography.fontSizes.medium,
    color: colors.text,
    fontWeight: typography.fontWeights.medium,
  },
  customRateInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.surface,
  },
  errorContainer: {
    backgroundColor: colors.error,
    padding: spacing.small,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.medium,
  },
  errorText: {
    color: colors.light,
    textAlign: 'center',
  },
  button: {
    padding: spacing.small,
    borderRadius: borderRadius.medium,
  },
  buttonLabel: {
    fontSize: typography.fontSizes.medium,
    paddingVertical: spacing.xs,
  },
  resultsCard: {
    ...shadows.medium,
    marginBottom: spacing.large,
    borderRadius: borderRadius.medium,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  resultsTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.medium,
    color: colors.primary,
    marginBottom: spacing.small,
  },
  divider: {
    marginVertical: spacing.small,
    height: 1,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.small,
  },
  resultLabel: {
    fontSize: typography.fontSizes.medium,
    color: colors.text,
  },
  resultValue: {
    fontSize: typography.fontSizes.medium,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.small,
    backgroundColor: colors.primaryLight,
    padding: spacing.medium,
    borderRadius: borderRadius.medium,
  },
  totalLabel: {
    fontSize: typography.fontSizes.large,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  totalValue: {
    fontSize: typography.fontSizes.large,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  saveButton: {
    marginTop: 16,
  },
  dialog: {
    borderRadius: borderRadius.large,
  },
  dialogTitle: {
    textAlign: 'center',
    color: colors.primary,
  },
  dialogInput: {
    marginBottom: spacing.medium,
    backgroundColor: colors.surface,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryItem: {
    padding: 8,
    margin: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0d6efd',
  },
  selectedCategory: {
    backgroundColor: '#0d6efd',
  },
  categoryText: {
    color: '#0d6efd',
  },
  selectedCategoryText: {
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small,
  },
  checkboxLabel: {
    marginLeft: spacing.small,
    fontSize: typography.fontSizes.medium,
    color: colors.text,
  },
  dialogButton: {
    minWidth: 100,
  },
});

export default CalculatorScreen; 