import { useState } from 'react';

export function useItemEdit() {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);

  const startEdit = (index: number, asNew = false) => {
    setEditingIndex(index);
    setIsNewItem(asNew);
  };

  const stopEdit = () => {
    setEditingIndex(null);
    setIsNewItem(false);
  };

  return { editingIndex, isNewItem, startEdit, stopEdit };
}
