declare type HeaderDateUnit = 'week' | 'day' | 'hour';

declare type DateUnit =
  | 'year'
  | 'month'
  | HeaderDateUnit
  | 'minute'
  | 'millisecond'
  | 'second';
