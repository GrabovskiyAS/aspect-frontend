<script setup lang="ts">
import { useBaseUrl } from '@/stores/baseUrl'
import Fieldset from 'primevue/fieldset'
import Tag from 'primevue/tag'
const baseUrl = useBaseUrl()
const props = defineProps(['serie', 'invertor', 'loading'])
</script>

<template>
  <div class="grid" v-if="!props.loading">
    <div class="col-4">
      <img
        v-if="props.serie.data[0].photo"
        :src="`${baseUrl.s3Storage}/${serie.data[0].photo}`"
        height="350"
        class="ml-5"
      />
      <img
        v-else
        :src="`${baseUrl.baseUrlInvertors}/inv_series/no_photo.jpg`"
        width="350"
        height="262"
      />
    </div>
    <div class="col-8">
      <div class="formgrid grid">
        <div class="field col">
          <Fieldset legend="Мощность" style="height: 170px">
            <div>
              <div class="mt-1" style="width: 100%">
                <Tag value="Pg" severity="primary" /> {{ invertor.p_heavy_g }} кВт
              </div>
              <div class="mt-1" style="width: 100%">
                <Tag value="Pp" severity="info" /> {{ invertor.p_pumps_p }} кВт
              </div>
            </div>
          </Fieldset>
        </div>
        <div class="field col">
          <Fieldset legend="Ток" style="height: 170px">
            <div>
              <div class="mt-1" style="width: 100%">
                <Tag value="Ig" severity="warn" /> {{ invertor.current_g }} А
              </div>
              <div class="mt-1" style="width: 100%">
                <Tag value="Ip" severity="danger" /> {{ invertor.current_p }} А
              </div>
            </div>
          </Fieldset>
        </div>
        <div class="field col">
          <Fieldset legend="Перегрузка" style="height: 170px">
            <div>
              <div v-if="props.invertor.overload_p_mode != 'None'" class="mt-1" style="width: 100%">
                <Tag value="Режим P" severity="info" /> {{ invertor.overload_p_mode }}
              </div>
              <div class="mt-1" style="width: 100%">
                <Tag value="Режим G" severity="info" /> {{ invertor.overload_g_mode }}
              </div>
            </div>
          </Fieldset>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <Fieldset legend="Управление" style="height: 200px">
            {{ invertor.type_of_control_str }}
          </Fieldset>
        </div>
        <div class="field col">
          <Fieldset legend="Панель" style="height: 200px">
            {{ invertor.type_of_panel_str }}
          </Fieldset>
        </div>
        <div class="field col">
          <Fieldset legend="Описание" style="height: 200px">
            {{ serie.data[0].description }}
          </Fieldset>
        </div>
      </div>
    </div>
  </div>
</template>
