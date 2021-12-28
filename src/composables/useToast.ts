import { watch } from 'vue';
import { useStore } from '@/store';

export default () => {
  const store = useStore();

  function hideToast() {
    store.isShowToast.value = false;
    store.toastMessage.value = '';
  }

  function showToast(message: string) {
    if (store.isShowToast.value) {
      store.isShowToast.value = false;
      setTimeout(() => {
        showToast(message);
      }, 500);
      return;
    }
    store.toastMessage.value = message;
    store.isShowToast.value = true;
  }

  watch(
    () => store.isShowToast.value,
    val => {
      if (val) {
        store.toastQueue.push(
          setTimeout(() => {
            hideToast();
          }, 3000)
        );
      } else {
        // 如果为 false，清除列表中所有定时器，否则会有意想不到的显示效果
        store.toastQueue.forEach(clearTimeout);
        store.toastQueue.length = 0;
      }
    }
  );

  return {
    isShowToast: store.isShowToast,
    toastMessage: store.toastMessage,
    showToast,
    hideToast
  };
};
