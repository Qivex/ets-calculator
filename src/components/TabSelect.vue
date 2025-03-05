<template>
	<nav class="tabselect">
		<button v-for="(tabname, index) in tabs" @click.left="$emit('update:modelValue', index)" :class="{currenttab: modelValue === index}">
			<svg width="40" height="40">
				<use :href="`#icon-${tabname}`"/>
			</svg>
		</button>

		<!-- Icons need to be inline (not embedded) for currentcolor to work -->
		<svg v-show="false">
			<symbol viewBox="0 0 16 16" id="icon-intro">
				<g fill="none" stroke="currentcolor" stroke-width="1">
					<circle cx="8" cy="2" r="1"/>
					<path d="M6,5 h3 v7 h1 v2 h-4 v-2 h1 v-5 h-1 v-2 z"/>
				</g>
			</symbol>
			<symbol viewBox="0 0 16 16" id="icon-upload">
				<path d="M3,9 v3 h10 v-3 M8,3 v7 M5,6 l3,-3 l3,3" fill="none" stroke="currentcolor" stroke-width="1"/>
			</symbol>
			<symbol viewBox="0 0 16 16" id="icon-trailer">
				<path d="M1,4 h14 v6 h-14 z" fill="currentcolor"/>
				<g fill="none" stroke="currentcolor" stroke-width="1">
					<circle cx="10" cy="11" r="1"/>
					<circle cx="13" cy="11" r="1"/>
				</g>
			</symbol>
			<symbol viewBox="0 0 16 16" id="icon-cargo">
				<path d="M2,5 v6 l6,3 l6,-3 v-6 l-6,-3 z l6,3 l6,-3 M8,8 v6" fill="none" stroke="currentcolor" stroke-width="1"/>
				<path d="M2,5 l6,3 l6,-3 l-6,-3 z" fill="currentcolor"/>
			</symbol>
			<symbol viewBox="0 0 16 16" id="icon-skills">
				<path d="M2,4 h2 m1,0 h2 m1,0 h2 m1,0 h2 M2,8 h2 m1,0 h2 M2,12 h2 m1,0 h2 m1,0 h2" stroke="currentcolor" stroke-width="2"/>
			</symbol>
			<symbol viewBox="0 0 16 16" id="icon-trip">
				<path d="M8,15 l4,-8 c2,-8 -10,-8 -8,0 z M8,3 a2.5,2.5 0,0,0 0,5 a2.5,2.5 0,0,0 0,-5" fill="currentcolor" fill-rule="evenodd"/>
			</symbol>
			<symbol viewBox="0 0 16 16" id="icon-result">
				<path d="M2,13 l4,-5 l2,2 l4,-5" fill="none" stroke="currentcolor" stroke-width="2"/>
				<path d="M10,4 l5,-2 l-2,5 z" fill="currentcolor"/>
			</symbol>
		</svg>
	</nav>
</template>



<script>
export default {
	props: {
		tabs: Array,
		modelValue: Number
	},
	emits: ["update:modelValue"]
}
</script>



<style>
.tabselect {
	display: flex;
	gap: 20px;
	margin-block: 1rem;
}

.tabselect button {
	padding: 10px;
	line-height: 0;
	border-radius: 50%;
	border: 2px solid #fab003;
	background-color: #494949;
	color: #c8c8c8;
}

.tabselect::after {
	z-index: -1;
	content: "";
	width: 500px;
	height: 2px;
	position: absolute;
	left: calc(50% - 250px);
	align-self: center;
	background-color: #fab003;
}

.tabselect button:is(:hover,:focus-visible) {
	background-color: #4c5b66;
	color: inherit;
}

.tabselect .currenttab {
	color: #fab003 !important;
}
</style>