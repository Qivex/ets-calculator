<template>
	<div class="filter-range">
		<input v-model="selectedMin" type="number"/>
		<div>
			<input v-model="selectedMin" type="range"/>
			<input v-model="selectedMax" type="range"/>
		</div>
		<input v-model="selectedMax" type="number"/>
	</div>
</template>

<script>
export default {
	props: {
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			required: true,
			validator(val, props) {
				return val >= props.min
			}
		},
		inc: {
			type: Number,
			default: 1,
			validator(val, props) {
				return val <= (props.max - props.min)
			}
		}
	},
	data() {
		return {
			selectedMin: this.min,
			selectedMax: this.max
		}
	}
}
</script>

<style>
.filter-range {
	display: grid;
	grid-template-columns: 4rem 1fr 4rem;
	grid-template-rows: 2rem;
}
</style>