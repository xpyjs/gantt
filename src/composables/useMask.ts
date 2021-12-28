import { computed } from 'vue';
import { useStore } from '@/store';

export default () => {
  const store = useStore();

  function showMask() {
    store.isShowMask.value = true;
  }

  function hideMask() {
    store.isShowMask.value = false;
  }

  const maskClass = computed(() => {
    return {
      'gt-mask-show': store.isShowMask.value,
      'gt-mask-hide': !store.isShowMask.value
    };
  });

  return {
    showMask,
    hideMask,

    maskClass
  };
};
