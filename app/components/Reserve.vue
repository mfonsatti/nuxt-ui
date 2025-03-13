<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    price: Number
});

const email = ref('');
const seats = ref(1);

const totalPrice = computed(() => (props.price * seats.value).toFixed(2));

const handlePurchase = () => {
alert(`Acquisto effettuato per ${seats.value} posti a ${totalPrice.value}€`);
};
</script>

<template>
    <UFormField label="Email" class="block">
        <UInput placeholder="Enter your email" />
    </UFormField>
    <UFormField label="Seats">
        <UInputNumber v-model="seats" :min="1" :max="5"/>
    </UFormField>
    <p class="text-lg font-semibold mb-4">Total: {{ totalPrice }}€</p>
</template>
  