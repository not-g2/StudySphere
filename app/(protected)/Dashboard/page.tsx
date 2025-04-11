"use client";

import dynamic from "next/dynamic";

const clientPage = dynamic(() => import("./dash"), { ssr: false });

export default clientPage;
