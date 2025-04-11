"use client";

import dynamic from "next/dynamic";

const clientPage = dynamic(() => import("./asdfg"), { ssr: false });

export default clientPage;
