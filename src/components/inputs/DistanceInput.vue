<template>
	<div class="input-distance">
		<input
			type="range"
			tabindex="-1"
			list="distance-tresholds"
			min="0"
			:max="tresholds.length - 1"
			:value="modelValue"
			@input="onValueSelect"
		/>
		<datalist id="distance-tresholds">
			<option
				v-for="(label,index) in tresholds"
				:value="index"
				tabindex="0"
				@click.left="onValueSelect"
				@keydown.enter="onValueSelect"
				@keydown.space="onValueSelect"
			>
				{{label}}
			</option>
		</datalist>
	</div>
</template>



<script>
export default {
	props: {
		modelValue: Number
	},
	data() {
		return {
			tresholds: [
				"<250km",
				"250-350km",
				"350-550km",
				"550-850km",
				"850-1100km",
				"1100-1500km",
				">1500km"
			]
		}
	},
	emits: ["update:modelValue"],
	methods: {
		onValueSelect(event) {
			this.$emit('update:modelValue', event.currentTarget.value)
		}
	}
}
</script>



<style>
.input-distance {
	width: 400px;
	display: flex;
	flex-direction: column;
}

/* Labels */
.input-distance datalist {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	writing-mode: sideways-lr;
	text-align: end;
	padding: 5px 13px;
}

.input-distance option {
	cursor: pointer;
}

.input-distance option:is(:hover,:focus-visible) {
	color: #fab003;
}
</style>