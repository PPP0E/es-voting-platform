"use client";

import { useState } from "react";

export default function ViewCounter({ views }) {
	const [hidden, setHidden] = useState(true);
	return (
		<p onClick={() => setHidden(!hidden)} className="bottom-5 cursor-pointer select-none left-5 fixed bg-content1/70 border p-1 px-4 text-sm rounded-full">
			{hidden ? <i className="">Show Views</i> : views + " views"}
		</p>
	);
}
