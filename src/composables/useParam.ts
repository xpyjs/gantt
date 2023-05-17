import useStore from '@/store';

export default () => {
  const store = useStore();

  return {
    $param: store.$param
  };
};
