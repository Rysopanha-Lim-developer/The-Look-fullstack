export default function LoadingBar(){
    return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
        {/* Custom animated loading bar */}
        <div className="relative h-0.75 w-48 overflow-hidden rounded-full bg-[#121212]/10">
            <div className="loading-bar-fill absolute inset-y-0 left-0 w-1/3 rounded-full bg-[#121212]" />
        </div>

        <p className="text-sm tracking-wide text-[#121212]">Loading</p>
        </div>

        <style>{`
        @keyframes loading-slide {
            0% {
            transform: translateX(-100%);
            }
            50% {
            transform: translateX(150%);
            }
            100% {
            transform: translateX(-100%);
            }
        }
        .loading-bar-fill {
            animation: loading-slide 1.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
            .loading-bar-fill {
            animation: none;
            }
        }
        `}</style>
    </div>
    )
}