import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import { colors, spacing } from '@/global/theme';
import { useRouter } from "expo-router";

type SearchProps = {
    value: string;
    onChange: (text: string) => void;
};


const Search = ({ value, onChange }: SearchProps) => {

    return (
        <View>
            <Searchbar
                placeholder="Nhập từ tiếng Việt (ví dụ: Mẹ, Ăn, ...)"
                style={styles.searchbar}
                inputStyle={styles.input}
                placeholderTextColor={colors.gray300}
                iconColor={colors.gray50}
                rippleColor={colors.gray300}
                cursorColor={colors.gray50}
                onChangeText={onChange}
                value={value}
                autoCapitalize='none'
                autoCorrect={false}
            />

            {/* {filteredData.length > 0 && (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => handleSelect(item.word)}
                        >
                            <Text style={styles.word}>{item.word}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.dropdown}
                />
            )} */}
        </View>
    );
};

export default Search;


const styles = StyleSheet.create({
    searchbar: {
        margin: 10,
        borderRadius: 20,
        backgroundColor: "#4B7FF2",
    },
    input: {
        fontSize: 16,
        color: colors.gray50,
    },
    dropdown: {
        zIndex: 10,
        backgroundColor: colors.gray50,
        marginHorizontal: spacing.sm,
        borderRadius: 10,
        maxHeight: 250,
        borderWidth: 1,
        borderColor: colors.gray300,
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    word: {
        fontSize: 16,
        color: colors.gray700,
    },
});