<template>
  <div
    class="gt-btn-wrap"
    :class="{ 'turn-animation': turn }"
    :style="{
      width: `${size}px`,
      height: `${size}px`
    }"
  >
    <i :class="`icon ${icon}`" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "GanttBtn",

  props: {
    icon: {
      type: String,
      required: true
    },

    turn: {
      type: Boolean
    },

    size: {
      type: Number,
      default: 30
    }
  }
});
</script>

<style scoped lang="scss">
.gt-btn-wrap {
  vertical-align: middle;
  text-align: center;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 1px 1px 5px 1px grey;
  -webkit-box-shadow: 1px 1px 5px 1px grey;
  -moz-box-shadow: 1px 1px 5px 1px grey;
  transition: right 0.2s;

  &:hover {
    filter: brightness(120%);
    box-shadow: shade(grey, 80%);
  }

  &:active {
    filter: brightness(90%);
    box-shadow: shade(grey, 80%);
  }
}

.turn-animation {
  animation: re-turn 0.5s ease-out;

  &:hover {
    animation: turn 0.5s ease-out;
  }
}

@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }

  25% {
    -webkit-transform: rotate(360deg);
  }

  50% {
    -webkit-transform: rotate(540deg);
  }

  75% {
    -webkit-transform: rotate(670deg);
  }

  100% {
    -webkit-transform: rotate(720deg);
  }
}

@keyframes re-turn {
  0% {
    -webkit-transform: rotate(720deg);
  }

  25% {
    -webkit-transform: rotate(360deg);
  }

  50% {
    -webkit-transform: rotate(180deg);
  }

  75% {
    -webkit-transform: rotate(50deg);
  }

  100% {
    -webkit-transform: rotate(0deg);
  }
}
</style>
