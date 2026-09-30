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
import { SRI_LANKAN_BRANCHES, BranchInfo } from '../constants/banks';

interface BranchSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectBranch: (branch: BranchInfo) => void;
  selectedBranchCode?: string;
}

export default function BranchSearchModal({
  visible,
  onClose,
  onSelectBranch,
  selectedBranchCode,
}: BranchSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = SRI_LANKAN_BRANCHES.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.includes(searchQuery) ||
      b.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (branch: BranchInfo) => {
    onSelectBranch(branch);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Select Bank Branch</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by branch name or branch code..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>

        <FlatList
          data={filteredBranches}
          keyExtractor={(item) => item.code}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={40} color="#CBD5E1" />
              <Text style={styles.emptyText}>No branches found for "{searchQuery}"</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isSelected = item.code === selectedBranchCode;
            return (
              <TouchableOpacity
                style={[styles.branchRow, isSelected && styles.selectedRow]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="business-outline" size={18} color="#0B1044" />
                </View>
                <View style={styles.rowTextContainer}>
                  <Text style={[styles.branchName, isSelected && styles.selectedText]}>
                    {item.name}
                  </Text>
                  <Text style={styles.branchSubText}>
                    Code: <Text style={styles.codeHighlight}>{item.code}</Text> • {item.district} District
                  </Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={22} color="#0B1044" />}
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  selectedRow: {
    backgroundColor: '#EFF6FF',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTextContainer: {
    flex: 1,
  },
  branchName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  selectedText: {
    color: '#0B1044',
    fontWeight: '700',
  },
  branchSubText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  codeHighlight: {
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
});
