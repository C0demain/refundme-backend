export type ExpenseByType = {
  date: string;
} & Record<Exclude<string, 'date'>, number>;

export type RequestByStatus = {
  status: string;
  count: number;
};

export type DateGranularity = 'week' | 'month' | 'quarter' | 'semester';