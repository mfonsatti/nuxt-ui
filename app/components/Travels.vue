<template>
    <div class="container mx-auto flex items-center justify-between p-4">
        <div class="flex flex-col items-center justify-center gap-4 h-screen">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <UCard v-for="travel in travels" :key="travel.id" class="flex flex-row items-center p-4">
                    <h3 class="text-lg font-semibold">{{ travel.name }}</h3>
                    <p>{{ travel.description }}</p>
                    <UModal v-model:open="openModals[travel.id]" :title="travel.name" :description="travel.description">
                        <UButton @click="openModals[travel.id] = true" icon="lucide:shopping-cart" size="md">Reserve your seat at {{
                            (travel.price *
                            state.seats).toFixed(2) }}€
                        </UButton>
                        <template #body>
                            <UForm :validate="validate" :state="state" class="space-y-4"
                                @submit.prevent="bookTrip(travel.id)">
                                <UFormField label="Email" name="email">
                                    <UInput v-model="state.email" type="email" />
                                </UFormField>

                                <UFormField label="Seats" name="seats">
                                    <UInputNumber v-model="state.seats" :min="1" :max="5" :default-value="1" />
                                </UFormField>

                                <UButton icon="lucide:shopping-cart" type="submit">
                                    Reserve this price for 15m: {{ (travel.price * state.seats).toFixed(2) }}€
                                </UButton>
                            </UForm>
                        </template>
                    </UModal>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

const openModals = reactive<Record<string, boolean>>({})

const state = reactive({
    email: '',
    seats: 1,
})

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.email) errors.push({ name: 'email', message: 'Required' })
    return errors
}

const toast = useToast()

interface Travel {
    id: string;
    name: string;
    description: string;
    price: number;
}

const props = defineProps<{
    travels: Travel[],
    price: Number
}>();

const bookTrip = async (travelId: string) => {
    const payload = {
        travel_id: travelId,
        user_email: state.email,
        seats: state.seats
    };

    try {
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.apiBaseUrl}/bookings/reserve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            toast.add({ title: "OOOps!", description: "Something went wrong. Check your data.", color: 'error' })
        }

        const data = await response.json();
        toast.add({ title: "You're almost done!", description: "Your Booking it's reserved for 15 minutes. Proceed to the cart to confirm.", color: 'success' })
    } catch (error) {
        toast.add({ title: "OOOps!", description: "Something went wrong. Check your data.", color: 'error' })
        console.error(error);
    } finally {
        openModals[travelId] = false
    }
};
</script>