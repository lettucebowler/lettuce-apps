import { prerender } from '$app/server';

import { getBarChartData as chartData } from './chart-data';
import { Integer } from './schemas';

export const getBarChartData = prerender(Integer, (year) => chartData(year));
