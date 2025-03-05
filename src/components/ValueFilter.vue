<template>
	<div class="filter">
		<h3>{{name}}</h3>
		<button @click.left="selected.fill(true)">All</button>
		<button @click.left="selected.fill(false)">None</button>
		<div class="filter-values">
			<label v-for="(value,index) in values" class="custom-checkbox">
				<input type="checkbox" v-model="selected[index]" tabindex="0" @keydown.enter="e => e.target.click()"/>
				<p>{{value}}</p>
			</label>
			<p v-if="values.length === 0">No values available</p>
		</div>
	</div>
</template>



<script>
export default {
	props: {
		name: String,
		values: Array
	},
	data() {
		return {
			selected: undefined	// Boolean array based on values (immediately set)
		}
	},
	watch: {
		values: {
			immediate: true,
			handler(newValues) {
				// Reset filter when new values were added
				this.selected = new Array(newValues.length).fill(true)
			}
		}
	},
	methods: {
		applyFilter(data, columnName) {
			// Collect all (unfiltered) values
			let remaining = this.values.filter((value, index) => this.selected[index])
			// Filter data
			return data.filter(value => remaining.includes(value[columnName]))
		}
	}
}
</script>

<style>
.filter-values {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px 16px;
	margin-block-end: 32px;
}

.filter button {
	margin-block-end: 10px;
	margin-inline-start: 10px;
}
</style>