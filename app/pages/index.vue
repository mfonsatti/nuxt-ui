<script setup>
const { data: travels } = useTravelApi();
</script>

<template>
	<NavBar />
	<Travels :travels="travels" />
</template>