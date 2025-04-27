<script setup lang="ts">
import Tag from 'primevue/tag'
const props = defineProps(['shaft_type_id', 'outputShaftSize'])
</script>

<template>
  <!-- Сплошной вал -->
  <div v-if="props.shaft_type_id === 10">
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="d6 x E7" /> = {{ outputShaftSize?.SD6 }} x
      {{ outputShaftSize?.SE7 }}
    </div>
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="t9/b" /> = {{ outputShaftSize?.St9 }}/{{ outputShaftSize?.Sb }}
    </div>
  </div>

  <!-- Полый вал -->
  <div v-if="props.shaft_type_id === 20">
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="D" /> = {{ outputShaftSize?.HD }}
    </div>
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="T/b" /> = {{ outputShaftSize?.St9 }}/{{ outputShaftSize?.Sb }}
    </div>
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="Q/Q1/Q3" /> = {{ outputShaftSize?.HQ }}/{{
        outputShaftSize?.HQ1
      }}/{{ outputShaftSize?.HQ3 }}
    </div>
  </div>

  <!-- Вал со стяжной муфтой -->
  <div v-if="props.shaft_type_id === 30">
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="D2" /> = {{ outputShaftSize?.JD2 }}
    </div>
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="D2/D3/d8" /> = {{ outputShaftSize?.JD2 }}/{{
        outputShaftSize?.JD3
      }}/{{ outputShaftSize?.Jd8 }}
    </div>
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="W/W1/W2/W5" /> = {{ outputShaftSize?.JW }}/{{
        outputShaftSize?.JW1
      }}/J{{ outputShaftSize?.JW2 }}/{{ outputShaftSize?.JW5 }}
    </div>
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="d8" /> = {{ outputShaftSize?.Jd8 }}
    </div>
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="W5" /> = {{ outputShaftSize?.JW5 }}
    </div>
  </div>

  <!-- Вал с эвольвентными шлицами -->
  <div v-if="props.shaft_type_id === 40">
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="D5" /> = {{ outputShaftSize?.LD5 }}
    </div>
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="W6" /> = {{ outputShaftSize?.LW6 }}
    </div>
    <div class="mt-1" style="width: 100%">
      <Tag severity="info" value="Q/W3/W4/Q4/S6" /> = {{ outputShaftSize?.LQ }}/{{
        outputShaftSize?.LW3
      }}/{{ outputShaftSize?.LW4 }}/{{ outputShaftSize?.LQ4 }}/{{ outputShaftSize?.LS6 }}
    </div>
  </div>
</template>
