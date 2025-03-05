<template>
	<button @click="showDialog">Filter</button>
	<dialog ref="dialog" class="filter-dialog">
		<slot/>
		<div class="filter-dialog-controls">
			<button @click.left="applyFilters">Apply</button>
			<button @click.left="closeDialog">Cancel</button>
		</div>
	</dialog>
</template>

<script>
export default {
	emits: ["filter"],
	methods: {
		showDialog() {
			this.$refs.dialog.showModal()
		},
		closeDialog() {
			this.$refs.dialog.close()
		},
		applyFilters() {
			this.$emit("filter")
			this.closeDialog()
		}
	}
}
</script>

<style>
.filter-dialog {
	color: inherit;
	background-color: #18191A;
	max-width: 75%;
}

.filter-dialog-controls {
	width: 100%;
	display: flex;
	justify-content: center;
	gap: 10px;
}

.filter-dialog h2 {
	margin-top: 0;
}

.filter-dialog h3 {
	display: inline;
}
</style>