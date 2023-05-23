import { withInstall } from '../utils/install';
import Root from '../components/root/RootWrap.vue';
import { Variables } from '../constants/vars';
import {
  type RootEmits,
  type RootMethods,
  type RootProps
} from 'typings/root/prop';

const XGantt = withInstall<RootProps, RootMethods, RootEmits>(
  Variables.name.root,
  Root
);

export default XGantt;
