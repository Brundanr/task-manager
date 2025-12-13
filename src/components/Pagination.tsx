import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { PaginationParams, PaginatedResponse } from '../types';
import { spacing } from '../theme';
import i18n from '../i18n';

interface PaginationProps {
  pagination: PaginationParams;
  paginatedData: PaginatedResponse<unknown> | null;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  paginatedData,
  onPageChange,
}) => {
  if (!paginatedData || paginatedData.totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    onPageChange(Math.max(1, pagination.page - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(paginatedData.totalPages, pagination.page + 1));
  };

  return (
    <View style={styles.pagination}>
      <View style={styles.paginationButton}>
        <Button
          mode="outlined"
          onPress={handlePrevious}
          disabled={pagination.page === 1}
          accessibilityLabel="Previous page"
        >
          <Text>{'<'}</Text>
        </Button>
      </View>
      <Text style={styles.pageText}>
      {i18n.t('tasks.page')} {pagination.page} {i18n.t('tasks.of')} {paginatedData.totalPages}
      </Text>
      <View style={styles.paginationButton}>
        <Button
          mode="outlined"
          onPress={handleNext}
          disabled={pagination.page === paginatedData.totalPages}
          accessibilityLabel="Next page"
        >
          <Text>{'>'}</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  paginationButton: {
    marginHorizontal: spacing.sm,
  },
  pageText: {
    marginHorizontal: spacing.md,
  },
});

