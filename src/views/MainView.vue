<script setup lang="ts">
import { ref } from 'vue'
import InvertorsMain from '@/components/Invertors/InvertorsMain.vue'
import ReductorsMain from '@/components/Reductors/ReductorsMain.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import Avatar from 'primevue/avatar'
import { useBaseUrl } from '@/stores/baseUrl'

const mode = ref<string>('1')
const baseUrl = useBaseUrl()
</script>

<template>
  <Tabs v-model:value="mode" class="mb-5 mt-5">
    <TabList>
      <Tab value="1">
        <p class="flex items-center gap-2 text-inherit">
          <Avatar
            :image="`${baseUrl.s3Storage}/f74f6d54-c409-4278-8295-6bd02416d203`"
            class="mr-2"
            size="xlarge"
          />
          <span class="font-bold text-lg">Преобразователи частоты (373)</span>
        </p>
      </Tab>
      <Tab value="2">
        <div class="grid">
          <Avatar :image="`${baseUrl.s3Storage}/reductor.jpg`" class="mr-2" size="xlarge" />

          <div class="col1-12">
            <span class="font-bold text-lg">Редукторы (3093)</span><br /><span
              >с переходным фланцем</span
            >
          </div>
        </div>
      </Tab>
    </TabList>
  </Tabs>

  <InvertorsMain v-if="mode == '1'" />
  <ReductorsMain v-if="mode == '2'" />
</template>
