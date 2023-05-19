import { withInstall } from '../utils/install';
import { Variables } from '../constants/vars';
import Column from 'components/column/index.vue';
import type props from '@/components/column/props';

type columnProps = Omit<typeof props, 'data' | '__index'>;

const XGanttColumn = withInstall<columnProps>(Variables.name.column, Column);

export default XGanttColumn;
