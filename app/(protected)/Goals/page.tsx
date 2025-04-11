"use client";

import dynamic from "next/dynamic";

const clientPage = dynamic(() => import("./plzzzwork"), { ssr: false });

export default clientPage;
