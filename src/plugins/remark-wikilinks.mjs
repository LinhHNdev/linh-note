export function slugify(value) {
	return value
		.normalize('NFKD')
		.toLowerCase()
		.trim()
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9/ -]/g, '')
		.replace(/[\s]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^\/+|\/+$/g, '');
}

function visit(parent) {
	if (!parent || !Array.isArray(parent.children)) return;

	const children = [];
	for (const child of parent.children) {
		if (child.type !== 'text' || !child.value.includes('[[')) {
			if (child.children) visit(child);
			children.push(child);
			continue;
		}

		const pattern = /\[\[([^\]]+)\]\]/g;
		let lastIndex = 0;
		let match;
		while ((match = pattern.exec(child.value)) !== null) {
			if (match.index > lastIndex) {
				children.push({ type: 'text', value: child.value.slice(lastIndex, match.index) });
			}

			const [rawTarget, rawAlias] = match[1].split('|');
			const target = rawTarget.trim();
			const [notePath, heading] = target.split('#', 2);
			const label = rawAlias?.trim() || notePath.split('/').at(-1).replace(/-/g, ' ');
			const href = `/notes/${slugify(notePath)}/${heading ? `#${slugify(heading)}` : ''}`;
			children.push({
				type: 'link',
					url: href,
						data: { hProperties: { className: ['wiki-link'] } },
						children: [{ type: 'text', value: label }],
				});
			lastIndex = pattern.lastIndex;
		}

		if (lastIndex < child.value.length) {
			children.push({ type: 'text', value: child.value.slice(lastIndex) });
		}
	}
	parent.children = children;
}

export default function remarkWikilinks() {
	return (tree) => visit(tree);
}
