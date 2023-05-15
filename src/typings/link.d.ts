import type RowItem from '@/models/data/row';
import { type Position } from '@vueuse/core';

declare interface LinkProps {
  from: string | number;
  to: string | number;
  color?: string;
  [key: string]: unknown;
}

declare interface LinkingItem {
  startPos: Position;
  endPos: Position;
  isLinking: boolean;
  startRow: RowItem | null;
  endRow: RowItem | null;
}
