<template>
	<table>
		<thead>
			<tr>
				<th v-for="(title,index) in columnTitles" @click="onSort(index)">
					{{title}}
					
						<img v-if="currentSortColumn != index" src="/svg/sort-neutral.svg"/>
						<img v-else-if="isCurrentSortAscending" src="/svg/sort-ascending.svg"/>
						<img v-else src="/svg/sort-descending.svg"/>
					
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="row in sortedRows" @click.left="setSelected">
				<td v-for="cell in row" v-html="cell"></td>
			</tr>
			<tr v-if="sortedRows.length === 0">
				<td :colspan="columnTitles.length">No entries available</td>
			</tr>
		</tbody>
	</table>
</template>



<script>
export default {
	props: {
		columnTitles: Array,
		rows: Array
	},
	emits: ["filter"],
	data() {
		return {
			sortedRows: this.rows,
			currentSortColumn: 0,	// The column which was last used for sorting
			isCurrentSortAscending: true
		}
	},
	watch: {
		rows(newRows) {
			this.sortedRows = newRows
			this.sortRows()
		}
	},
	methods: {
		onSort(column) {
			// Keep track of current sort to avoid sorting again
			if (column == this.currentSortColumn) {
				this.isCurrentSortAscending = !this.isCurrentSortAscending
			} else {
				this.currentSortColumn = column
				this.isCurrentSortAscending = true
			}
			// Actual sorting
			this.sortRows()
		},
		sortRows() {
			// Cant sort if no rows
			if (this.sortedRows.length === 0) return
			// Sort in place
			let col = Object.keys(this.sortedRows[0])[this.currentSortColumn]
			let asc = this.isCurrentSortAscending
			this.sortedRows.sort((a,b) => {
				if (a[col] == b[col]) return 0
				return (a[col] > b[col] == asc) ? 1 : -1
			})
			// Remove previous selection (because row will be filled with different entry)
			this.clearSelected()
		},
		setSelected(event) {
			this.clearSelected()
			// event.target is *some* child, but class should be added to <tr> => event.currentTarget
			event.currentTarget.classList.add("selected")
		},
		clearSelected() {
			let previous = document.querySelector(".selected")
			if (previous)
				previous.classList.remove("selected")
		}
	}
}
</script>



<style>
table {
	border-spacing: 0 4px;
	color: #c8c8c8;
	font-size: 14px;
}

th {
	padding-inline: 1rem;
	font-weight: 600;
	cursor: pointer;
}

th:hover {
	color: #fab003;
}

tr {
	background-color: #393939;
	height: 36px;
}

tbody :is(tr:hover, tr.selected) {
	background-color: #4c5b66 !important;
}

tbody tr:nth-child(2n+1) {
	background-color: #494949;
}

td {
	text-align: center;
	padding-inline: 1rem;
}

td:first-child {
	text-align: initial;
}

table img {
	height: 12px;
	margin-inline-start: 4px;
}
</style>