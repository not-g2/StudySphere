"use client";

import dynamic from "next/dynamic";

const clientPage = dynamic(() => import("./qwerty"), { ssr: false });

export default clientPage;
