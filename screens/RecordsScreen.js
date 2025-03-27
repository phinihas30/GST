import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, Searchbar, Divider, List, IconButton, ActivityIndicator, Chip, Text, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const STORAGE_KEY = 'GST_RECORDS';

const RecordsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadRecords();
    }
  }, [isFocused]);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const recordsJson = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('Records JSON:', recordsJson);
      const loadedRecords = recordsJson ? JSON.parse(recordsJson) : [];
      console.log('Loaded Records:', loadedRecords);
      setRecords(loadedRecords);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(loadedRecords.map(record => record.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading records:', error);
      Alert.alert('Error', 'Failed to load records: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    try {
      const updatedRecords = records.filter(record => record.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
      setRecords(updatedRecords);
      
      // Update categories
      const uniqueCategories = ['All', ...new Set(updatedRecords.map(record => record.category))];
      setCategories(uniqueCategories);
      
      Alert.alert('Success', 'Record deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete record: ' + error.message);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const updatedRecords = records.map(record => {
        if (record.id === id) {
          return { ...record, isFavorite: !record.isFavorite };
        }
        return record;
      });
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
      setRecords(updatedRecords);
    } catch (error) {
      Alert.alert('Error', 'Failed to update record: ' + error.message);
    }
  };

  const sortRecords = (recordsToSort) => {
    return [...recordsToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'name':
          comparison = a.productName.localeCompare(b.productName);
          break;
        default:
          comparison = new Date(a.date) - new Date(b.date);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filteredRecords = records.filter(record => 
    (searchQuery ? record.productName.toLowerCase().includes(searchQuery.toLowerCase()) : true) &&
    (selectedCategory !== 'All' ? record.category === selectedCategory : true)
  );

  const filteredAndSortedRecords = sortRecords(filteredRecords);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const renderSortIcon = () => {
    return sortOrder === 'asc' ? 'arrow-up' : 'arrow-down';
  };

  const calculateTotalGST = () => {
    return filteredAndSortedRecords.reduce((sum, record) => sum + record.gstAmount, 0).toFixed(2);
  };

  const renderEmptyComponent = () => (
    <Card style={styles.emptyCard}>
      <Card.Content style={styles.emptyContent}>
        <IconButton
          icon="database-off"
          size={50}
          color={colors.subtext}
        />
        <Title style={styles.emptyTitle}>No Records Found</Title>
        <Paragraph style={styles.emptyText}>No GST records match your search criteria.</Paragraph>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Calculator')}
          style={styles.addButton}
          icon="plus"
        >
          Add New Record
        </Button>
      </Card.Content>
    </Card>
  );

  const renderRecord = ({ item }) => (
    <Card 
      style={[
        styles.recordCard, 
        item.isFavorite && styles.favoriteCard
      ]}
    >
      <Card.Content>
        <View style={styles.recordHeader}>
          <View style={styles.titleContainer}>
            <Title style={styles.recordTitle}>{item.productName}</Title>
            {item.isFavorite && (
              <IconButton
                icon="star"
                size={16}
                color={colors.secondary}
                style={styles.starIcon}
              />
            )}
          </View>
          <View style={styles.headerButtons}>
            <IconButton
              icon={item.isFavorite ? "star" : "star-outline"}
              size={20}
              color={item.isFavorite ? colors.secondary : colors.subtext}
              onPress={() => toggleFavorite(item.id)}
            />
            <IconButton
              icon="delete"
              size={20}
              color={colors.error}
              onPress={() => deleteRecord(item.id)}
            />
          </View>
        </View>
        
        <View style={styles.categoryRow}>
          <Chip 
            icon="tag" 
            style={[
              styles.recordCategory,
              {backgroundColor: getCategoryColor(item.category)}
            ]}
            textStyle={styles.categoryText}
          >
            {item.category}
          </Chip>
          <Paragraph style={styles.dateText}>
            {formatDate(item.date)}
          </Paragraph>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.recordDetails}>
          <View style={styles.recordRow}>
            <Paragraph style={styles.recordLabel}>Base Amount:</Paragraph>
            <Paragraph style={styles.recordValue}>₹ {item.baseAmount.toFixed(2)}</Paragraph>
          </View>
          <View style={styles.recordRow}>
            <Paragraph style={styles.recordLabel}>GST Rate:</Paragraph>
            <Badge style={styles.rateBadge}>{item.gstRate}%</Badge>
          </View>
          <View style={styles.recordRow}>
            <Paragraph style={styles.recordLabel}>GST Amount:</Paragraph>
            <Paragraph style={styles.recordValue}>₹ {item.gstAmount.toFixed(2)}</Paragraph>
          </View>
        </View>
        
        <View style={styles.totalContainer}>
          <Paragraph style={styles.totalLabel}>Total Amount:</Paragraph>
          <Paragraph style={styles.totalValue}>₹ {item.totalAmount.toFixed(2)}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  const getCategoryColor = (category) => {
    const categoryColors = {
      'General': '#e3f2fd',
      'Food': '#e8f5e9',
      'Electronics': '#ede7f6',
      'Clothing': '#fff3e0',
      'Services': '#e1f5fe',
      'Healthcare': '#f3e5f5',
      'Education': '#e0f7fa',
      'Other': '#fce4ec',
    };
    
    return categoryColors[category] || '#e3f2fd';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBanner}>
        <Text style={styles.title}>GST Records</Text>
      </View>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search records..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
          icon="magnify"
          clearIcon="close-circle"
        />
      </View>
      
      {filteredAndSortedRecords.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="receipt-long" size={60} color="#adb5bd" />
          <Text style={styles.emptyStateText}>No GST records found</Text>
          <Text style={styles.emptyStateSubtext}>Records you save will appear here</Text>
        </View>
      )}
      
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                {backgroundColor: selectedCategory === category ? colors.primary : colors.light}
              ]}
              textStyle={{
                color: selectedCategory === category ? colors.light : colors.text
              }}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
        
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <View style={styles.sortButtons}>
            <Chip
              selected={sortBy === 'date'}
              onPress={() => setSortBy('date')}
              style={styles.sortChip}
              textStyle={sortBy === 'date' ? styles.selectedSortText : styles.sortText}
            >
              Date
            </Chip>
            <Chip
              selected={sortBy === 'amount'}
              onPress={() => setSortBy('amount')}
              style={styles.sortChip}
              textStyle={sortBy === 'amount' ? styles.selectedSortText : styles.sortText}
            >
              Amount
            </Chip>
            <Chip
              selected={sortBy === 'name'}
              onPress={() => setSortBy('name')}
              style={styles.sortChip}
              textStyle={sortBy === 'name' ? styles.selectedSortText : styles.sortText}
            >
              Name
            </Chip>
            <IconButton
              icon={renderSortIcon()}
              size={20}
              color={colors.primary}
              onPress={toggleSortOrder}
              style={styles.sortOrderButton}
            />
          </View>
        </View>
      </View>
      
      <Card style={styles.summaryCard}>
        <Card.Content>
          <View style={styles.summaryHeader}>
            <Title style={styles.summaryTitle}>Summary</Title>
            <Badge style={styles.countBadge}>{filteredAndSortedRecords.length}</Badge>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.summaryRow}>
            <Paragraph style={styles.summaryLabel}>Total Records:</Paragraph>
            <Paragraph style={styles.summaryValue}>{filteredAndSortedRecords.length}</Paragraph>
          </View>
          <View style={styles.summaryRow}>
            <Paragraph style={styles.summaryLabel}>Total GST Paid:</Paragraph>
            <Paragraph style={styles.summaryValue}>
              ₹ {calculateTotalGST()}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Paragraph style={styles.loadingText}>Loading records...</Paragraph>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredAndSortedRecords}
            renderItem={renderRecord}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyComponent}
          />
          
          {filteredAndSortedRecords.length > 0 && (
            <Button
              mode="contained"
              icon="plus"
              style={styles.floatingButton}
              onPress={() => navigation.navigate('Calculator')}
              labelStyle={styles.floatingButtonLabel}
            >
              Add New Record
            </Button>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerBanner: {
    backgroundColor: '#0d6efd',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  searchBar: {
    borderRadius: 12,
    elevation: 2,
  },
  filtersContainer: {
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
  categoriesContainer: {
    paddingBottom: spacing.small,
  },
  categoryChip: {
    marginRight: spacing.small,
    marginBottom: spacing.small,
    ...shadows.small,
  },
  sortContainer: {
    marginTop: spacing.small,
  },
  sortLabel: {
    fontSize: typography.fontSizes.small,
    color: colors.subtext,
    marginBottom: spacing.xs,
  },
  sortButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortChip: {
    marginRight: spacing.small,
    ...shadows.small,
  },
  sortText: {
    fontSize: typography.fontSizes.small,
  },
  selectedSortText: {
    fontSize: typography.fontSizes.small,
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
  },
  sortOrderButton: {
    margin: 0,
  },
  summaryCard: {
    margin: spacing.medium,
    ...shadows.medium,
    borderRadius: borderRadius.medium,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: typography.fontSizes.large,
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
  },
  countBadge: {
    backgroundColor: colors.primary,
  },
  divider: {
    marginVertical: spacing.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
  },
  summaryLabel: {
    color: colors.text,
    fontSize: typography.fontSizes.medium,
  },
  summaryValue: {
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
    fontSize: typography.fontSizes.medium,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large * 2,
  },
  loadingText: {
    marginTop: spacing.medium,
    color: colors.subtext,
  },
  listContent: {
    padding: spacing.medium,
    paddingBottom: spacing.large * 3,
  },
  emptyCard: {
    marginTop: spacing.large,
    ...shadows.small,
    borderRadius: borderRadius.medium,
  },
  emptyContent: {
    alignItems: 'center',
    padding: spacing.large,
  },
  emptyTitle: {
    marginTop: spacing.medium,
    color: colors.text,
  },
  emptyText: {
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  recordCard: {
    marginBottom: spacing.medium,
    ...shadows.small,
    borderRadius: borderRadius.medium,
  },
  favoriteCard: {
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordTitle: {
    fontSize: typography.fontSizes.large,
    fontWeight: typography.fontWeights.medium,
  },
  starIcon: {
    margin: 0,
    padding: 0,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  recordCategory: {
    ...shadows.small,
  },
  categoryText: {
    fontSize: typography.fontSizes.small,
  },
  dateText: {
    fontSize: typography.fontSizes.small,
    color: colors.subtext,
  },
  recordDetails: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.medium,
    padding: spacing.medium,
    marginVertical: spacing.small,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  recordLabel: {
    fontSize: typography.fontSizes.medium,
    color: colors.text,
  },
  recordValue: {
    fontSize: typography.fontSizes.medium,
    color: colors.text,
  },
  rateBadge: {
    backgroundColor: colors.primary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    padding: spacing.medium,
    borderRadius: borderRadius.medium,
    marginTop: spacing.small,
  },
  totalLabel: {
    fontSize: typography.fontSizes.medium,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  totalValue: {
    fontSize: typography.fontSizes.medium,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  addButton: {
    marginTop: spacing.medium,
  },
  floatingButton: {
    position: 'absolute',
    bottom: spacing.large,
    right: spacing.large,
    left: spacing.large,
    borderRadius: borderRadius.medium,
    ...shadows.large,
  },
  floatingButtonLabel: {
    fontSize: typography.fontSizes.medium,
    paddingVertical: spacing.xs,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 8,
  },
});

export default RecordsScreen; 