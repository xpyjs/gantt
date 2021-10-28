import { computed, ref } from 'vue';

const isShowMask = ref(false);

export default () => {
  function showMask() {
    isShowMask.value = true;
  }

  function hideMask() {
    isShowMask.value = false;
  }

  const maskClass = computed(() => {
    return {
      'gt-mask-show': isShowMask.value,
      'gt-mask-hide': !isShowMask.value
    };
  });

  return {
    showMask,
    hideMask,

    maskClass
  };
};
