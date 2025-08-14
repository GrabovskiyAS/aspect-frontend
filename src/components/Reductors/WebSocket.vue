<template>
  <div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { io } from 'socket.io-client';

const messages = ref<any>([]);
// const message = ref('');
const socketId = ref<any>(null);
const props = defineProps(['roomId'])
const pdf1 = defineModel<string>('pdf1')
const pdf2 = defineModel<string>('pdf2')

// подключаемся к серверу
const socket = io(import.meta.env.VITE_BACKEND_REDUCTORS, {
  // для передачи токена:
  // auth: { token: 'JWT...' }
});

onMounted(() => {
  console.log('websocket onMounted');

  socket.on('connect', () => {
    socketId.value = socket.id;
    console.log('connected', socket.id);
  });

  socket.on('message', (payload) => {
    // messages.value.push(payload);
  });

  socket.on('system', (payload: any) => {
    messages.value.push({ from: 'system', text: payload.text });
  });

  socket.on('joined', (payload) => {
    messages.value.push({ from: 'system', text: `Joined ${payload.room}` });
  });

  // пример приватного уведомления
  socket.on('notification', (p) => {
    messages.value.push({ from: 'server', text: p.text });
  });

  // пример приватного уведомления в комнату
  socket.on('roomMessage', (p) => {
    // console.log('это roomMessage', p);
    if (p?.pdf1) pdf1.value = p.pdf1;
    if (p?.pdf2) pdf2.value = p.pdf2;
    messages.value.push({ from: 'server', text: p?.pdf1 || p?.pdf2 });
  });

  joinRoom()
});

onBeforeUnmount(() => {
  socket.disconnect();
});

// function send() {
//   if (!message.value) return;
//   // emit событие 'message' на сервер
//   socket.emit('message', { text: message.value });
//   message.value = '';
// }

function joinRoom() {
  socket.emit('joinRoom', { room: props.roomId });
  console.log('joinRoom', props.roomId);
}
</script>
