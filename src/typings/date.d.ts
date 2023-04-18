declare type HeaderDateUnit = 'week' | 'day' | 'hour' | 'minute';

declare type DateUnit =
  | 'year'
  | 'month'
  | HeaderDateUnit
  | 'millisecond'
  | 'second';
