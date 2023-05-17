declare type HeaderDateUnit = 'month' | 'week' | 'day' | 'hour';

declare type DateUnit =
  | 'year'
  | HeaderDateUnit
  | 'minute'
  | 'millisecond'
  | 'second';
