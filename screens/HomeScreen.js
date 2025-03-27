import React from 'react';
import { StyleSheet, View, ScrollView, Image, Dimensions } from 'react-native';
import { Button, Card, Title, Paragraph, Text, Divider, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  // Common GST rates in India with descriptions
  const gstRates = [
    { rate: '0%', description: 'Essential goods like fresh fruits, vegetables', color: '#e3f2fd', icon: '🍎' },
    { rate: '5%', description: 'Basic necessities, packaged food', color: '#e8f5e9', icon: '🥫' },
    { rate: '12%', description: 'Processed food, business hotels', color: '#fff3e0', icon: '🍲' },
    { rate: '18%', description: 'Standard services, electronics', color: '#e1f5fe', icon: '💻' },
    { rate: '28%', description: 'Luxury items, cars, tobacco', color: '#f3e5f5', icon: '🚗' },
  ];

  const handleOpenCalculator = () => {
    navigation.navigate('Calculator');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Banner */}
        <View style={styles.headerBanner}>
          <Text style={styles.title}>GST Calculator</Text>
          <Text style={styles.subtitle}>
            Your complete solution for GST calculations in India
          </Text>
        </View>

        {/* Quick Calculate Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="calculator" color="#fff" style={{backgroundColor: colors.primary}} />
              <Title style={styles.cardTitle}>Quick Calculate</Title>
            </View>
            <Paragraph style={styles.cardDescription}>
              Calculate GST amounts for any product or service with different tax slabs
            </Paragraph>
            <Button 
              mode="contained" 
              icon="calculator"
              onPress={handleOpenCalculator}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Open Calculator
            </Button>
          </Card.Content>
        </Card>

        {/* GST Rates Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="percent" color="#fff" style={{backgroundColor: colors.primary}} />
              <Title style={styles.cardTitle}>GST Rates</Title>
            </View>
            <Paragraph style={styles.cardDescription}>Current GST rates in India</Paragraph>
            
            <Divider style={styles.divider} />
            
            <View style={styles.ratesContainer}>
              {gstRates.map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.rateItem, 
                    { backgroundColor: item.color }
                  ]}
                >
                  <View style={styles.rateIconContainer}>
                    <Text style={styles.rateIcon}>{item.icon}</Text>
                  </View>
                  <View style={styles.rateContent}>
                    <Text style={styles.rateValue}>{item.rate}</Text>
                    <Text style={styles.rateLabel}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Info Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="information" color="#fff" style={{backgroundColor: colors.primary}} />
              <Title style={styles.cardTitle}>About GST</Title>
            </View>
            <Paragraph style={styles.cardDescription}>
              Goods and Services Tax (GST) is an indirect tax used in India on the supply of goods and services.
            </Paragraph>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Key Features:</Text>
              <View style={styles.infoItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.infoText}>Replaced multiple indirect taxes</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.infoText}>Destination-based tax</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.infoText}>Applied at each stage of value addition</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.infoText}>Input Tax Credit available for businesses</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Copyright © 2025 GST Calculator App</Text>
        </View>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d6efd',
    marginLeft: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 4,
    backgroundColor: '#0d6efd',
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 16,
    backgroundColor: '#dee2e6',
  },
  ratesContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  rateItem: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
  },
  rateIcon: {
    fontSize: 24,
  },
  rateContent: {
    flex: 1,
  },
  rateValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d6efd',
    marginBottom: 4,
  },
  rateLabel: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: '#e9f2ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0d6efd',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0d6efd',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#0d6efd',
    marginRight: 10,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
  },
});

export default HomeScreen; 