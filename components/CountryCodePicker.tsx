import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COUNTRY_CODES, CountryCodeItem } from '../constants/validation';

interface CountryCodePickerProps {
  selectedCode: string;
  onSelect: (item: CountryCodeItem) => void;
}

export default function CountryCodePicker({ selectedCode, onSelect }: CountryCodePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentItem = COUNTRY_CODES.find((c) => c.code === selectedCode) || COUNTRY_CODES[0];

  const filteredCountries = COUNTRY_CODES.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.includes(searchQuery) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: CountryCodeItem) => {
    onSelect(item);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.badgeContainer}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flagEmoji}>{currentItem.flag}</Text>
        <Text style={styles.countryCodeText}>{currentItem.code}</Text>
        <Ionicons name="chevron-down" size={14} color="#64748B" style={styles.chevron} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Country Code</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search country or dial code..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => `${item.country}-${item.code}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isSelected = item.code === selectedCode;
              return (
                <TouchableOpacity
                  style={[styles.countryRow, isSelected && styles.selectedRow]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.rowFlag}>{item.flag}</Text>
                  <View style={styles.rowTextContainer}>
                    <Text style={[styles.rowCountryName, isSelected && styles.selectedText]}>
                      {item.name}
                    </Text>
                    <Text style={styles.rowCountryCode}>{item.code}</Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={22} color="#0B1044" />}
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 4,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  chevron: {
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: '#0F172A',
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  selectedRow: {
    backgroundColor: '#EFF6FF',
  },
  rowFlag: {
    fontSize: 24,
    marginRight: 14,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowCountryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  selectedText: {
    color: '#0B1044',
    fontWeight: '700',
  },
  rowCountryCode: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
});
