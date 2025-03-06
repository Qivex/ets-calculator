<template>
	<div class="input-urgency">
		<label v-for="(label,index) in levels" class="custom-checkbox">
			<input
				type="radio"
				tabindex="0"
				:value="index"
				:checked="modelValue === index"
				@input="onValueSelect"
			/>
			<p>{{label}}</p>
			<img v-if="label === 'Normal'" src="/svg/urgency-normal.svg"/>
			<img v-else-if="label === 'Important'" src="/svg/urgency-important.svg"/>
			<img v-else-if="label === 'Urgent'" src="/svg/urgency-urgent.svg"/>
		</label>
	</div>
</template>



<script>
export default {
	props: {
		modelValue: Number
	},
	data() {
		return {
			levels: [
				"Normal",
				"Important",
				"Urgent"
			]
		}
	},
	emits: ["update:modelValue"],
	methods: {
		onValueSelect(event) {
			this.$emit('update:modelValue', parseInt(event.currentTarget.value))
		}
	}
}
</script>



<style>
.input-urgency {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.input-urgency label {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 4px;
}

.input-urgency img {
	height: 18px;
}
</style>