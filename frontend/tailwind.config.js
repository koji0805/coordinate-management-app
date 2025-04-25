// tailwind.config.js（または tailwind.config.mjs）
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    safelist: [
        'bg-red-600',
        'bg-orange-400',
        'bg-yellow-300',
        'bg-green-600',
        'bg-blue-600',
        'bg-purple-600',
        'bg-cyan-200',
        'bg-lime-200',
        'bg-pink-400',
        'bg-slate-400',
        'bg-slate-200',
        'bg-\[\#e2d06e\]',
        'bg-stone-950',
        'bg-white',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
