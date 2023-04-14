export const getColumnWidth = (width: number | string) => {
  return `${typeof width === 'number' ? width : Number.parseInt(width)}px`;
};
