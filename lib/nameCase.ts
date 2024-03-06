export function nameCase(name) {
	const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	const capitalized = name
		.replace(/[^a-zA-Z-' ]/g, "")
		.split(/\s|-/)
		.map(capitalize)
		.join(" ")
		.replace(/-/g, " - ");
	return capitalized;
}
