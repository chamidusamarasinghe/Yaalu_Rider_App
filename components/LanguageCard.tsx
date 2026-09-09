import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface LanguageCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function LanguageCard({ label, selected, onSelect }: LanguageCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onSelect}
      style={tw`flex-row items-center justify-between bg-white py-4 px-5 rounded-2xl border-2 mb-3.5 shadow-sm ${
        selected ? 'border-[#0B1044] shadow-md' : 'border-slate-100'
      }`}>
      <Text style={tw`text-lg ${selected ? 'font-bold text-[#0B1044]' : 'font-semibold text-slate-800'}`}>
        {label}
      </Text>
      
      {selected ? (
        <View style={tw`w-7 h-7 rounded-full bg-[#E4F43A] items-center justify-center`}>
          <Ionicons name="checkmark" size={16} color="#000000" />
        </View>
      ) : (
        <View style={tw`w-6 h-6 rounded-full bg-slate-200`} />
      )}
    </TouchableOpacity>
  );
}
