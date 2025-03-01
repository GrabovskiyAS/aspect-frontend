<script setup lang="ts">
// import { useBaseUrl } from '@/stores/baseUrl'
import Fieldset from 'primevue/fieldset'
import Tag from 'primevue/tag'
const props = defineProps(['red', 'loading'])
</script>

<template>
  <div class="grid">
    <div class="col-8">
      <div class="formgrid grid">
        <div class="field col">
          <Fieldset legend="Параметры" style="height: 170px">
            <div>
              <div class="mt-1" style="width: 100%">
                <Tag value="T2N" severity="primary" /> {{ props.red.t2n }}
              </div>
              <div class="mt-1" style="width: 100%">
                <Tag value="I" severity="info" /> {{ props.red.I }}
              </div>
              <div class="mt-1" style="width: 100%">
                <Tag value="Na" severity="info" /> {{ props.red.Na }} об/мин
              </div>
              <div class="mt-1" style="width: 100%">
                <Tag value="sf" severity="info" /> {{ props.red.sf }}
              </div>
            </div>
          </Fieldset>
        </div>
      </div>
    </div>
  </div>
</template>
