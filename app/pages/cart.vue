<script setup lang="ts">

const state = reactive({
	email: ''
})

const toast = useToast()
const isLoading = ref(false)

interface Reservation {
	id: string
	name: string
	seats: number
	amount: number
	expires_at: string
	expired: boolean
	status: string
	travel: {
		name: string
		description: string
	}
	loading: boolean
	paid: boolean
}

const reservations = ref<Reservation[]>([])
const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl

const fetchReservations = async () => {
	if (!state.email) {
		toast.add({ title: 'Error', description: 'Please enter a valid email.', color: 'error' })
		return
	}
  
  	isLoading.value = true
  	try {
		const response = await fetch(`${apiBaseUrl}/bookings`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				user_email: state.email
			})
		});

		if (!response.ok) {
			throw new Error('Failed to fetch reservations')
		}
		
		const data = await response.json()
		if(!data.length) {
			toast.add({ title: 'OOPsss', description: 'No reservations for this email address', color: 'warning' })
		}

		reservations.value = data.map((reservation: Reservation) => ({
			...reservation,
			expired: new Date(reservation.expires_at) < new Date(),
			paid: reservation.status === 'confirmed',
			loading: false
		}))
		
	} catch (error) {
		toast.add({ title: 'Error', description: 'Could not retrieve reservations.', color: 'error' })
		reservations.value = []
	} finally {
		isLoading.value = false
	}
}

const confirmSingleBooking = async (bookingId: string) => {
	const booking = reservations.value.find(res => res.id === bookingId);
	if (!booking) return;

	// Imposta lo stato "loading"
	booking.loading = true;

	try {
		const response = await fetch(`${apiBaseUrl}/bookings/confirm`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ booking_id: bookingId })
		});

		const {status, message} = await response.json()

		if (status === 'error') {
			throw new Error(message);
		}

		booking.paid = true;

		toast.add({ title: "Success", description: "Booking confirmed!", color: "success" });

	} catch (error) {
		if (error instanceof Error){
			toast.add({ title: "Error", description: error.message, color: "error" });
		}
	} finally {
		booking.loading = false;
	}
};

</script>

<template>
	<NavBar />
	<div class="container mx-auto p-4">
		<h2 class="text-xl font-semibold mb-4">Your Cart</h2>

		<UForm :state="state" @submit.prevent="fetchReservations" class="mb-4 flex gap-2">
			<UInput v-model="state.email" placeholder="Booking email" type="email" />
			<UButton type="submit" :disabled="isLoading">
			<template v-if="isLoading">
				<USpinner class="mr-2" /> Loading...
			</template>
			<template v-else>
				Search
			</template>
			</UButton>
		</UForm>

		<div v-if="reservations.length > 0" class="space-y-4">
			<UCard v-for="reservation in reservations" :key="reservation.id" class="p-6 rounded-lg bg-white">
				<div class="flex justify-between items-center">
					<div class="flex-1">
						<h3 class="text-lg font-semibold">{{ reservation.travel.name }}</h3>
						<p>{{ reservation.travel.description }}</p>
						<p>Seats: <span>{{ reservation.seats }}</span></p>
						<p>Reserved: <span>{{ reservation.amount }}€</span></p>
					</div>
					<div class="flex items-center">
						<div v-if="reservation.expired && !reservation.paid" class="text-red-500 font-bold flex items-center">
							<UIcon name="lucide:alert-triangle" class="mr-2" /> Expired
						</div>
						<UButton v-else-if="!reservation.paid"
							icon="lucide:shopping-cart"
							@click="confirmSingleBooking(reservation.id)"
							:disabled="reservation.loading"
						>
							<template v-if="reservation.loading">
								<USpinner class="mr-2" /> Processing...
							</template>
							<template v-else>
								Buy Now
							</template>
						</UButton>
						<div v-if="reservation.paid" class="text-green-500 font-bold flex items-center ml-4">
							<UIcon name="lucide:check-circle" class="mr-2" /> Paid
						</div>
					</div>
				</div>
			</UCard>
		</div>
	</div>
</template>