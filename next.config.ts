import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //Run command below to install node module
  //npm install babel-plugin-react-compiler@latest
  //after install write the one line below
  reactCompiler: true, //This line eliminate the need of useMemo React hook

  cacheComponents: true, //This enable caching system 'use cache' for cache boundaries 
};

export default nextConfig;
