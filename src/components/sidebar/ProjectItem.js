import React, { useState } from 'react';

function ProjectItem({ project, isSelected, onSelect }) {
	const [hovered, setHovered] = useState(false);

	return (
		<div
			className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
				isSelected ? 'bg-blue-500' : 'bg-slate-700 hover:bg-slate-600'
			}`}
			onClick={onSelect}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<span className="truncate">{project.name}</span>
			{hovered && (
				<span className="flex gap-2 ml-2">
					<span title="Edit" className="cursor-pointer text-slate-300 hover:text-white">🖊️</span>
					<span title="Delete" className="cursor-pointer text-red-400 hover:text-red-600">🗑️</span>
				</span>
			)}
		</div>
	);
}

export default ProjectItem;
