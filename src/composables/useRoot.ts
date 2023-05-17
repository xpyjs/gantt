import useStore from '@/store';

export default () => {
  const { rootRef } = useStore();

  return {
    rootRef
  };
};
