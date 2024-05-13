import { useCallback, useRef } from "react";
import { AnimatePresence, useAnimationFrame, motion } from "framer-motion";
import Color from "color";
import { SongInfo } from "../types";

export default function ProgressBar({ songInfo, lastProgressSet, loading, className, progressColor = "#ffffff" }: { songInfo: SongInfo, lastProgressSet?: Date, loading: boolean, className?: string, progressColor?: string }) {
    const progressBar = useRef<HTMLProgressElement>(null)
    const handleTicker = useCallback(() => {
        if (loading || !songInfo.progress || !lastProgressSet || songInfo.state !== "playing" || !songInfo.duration) return
        const currentTimestamp = (songInfo.progress + (Date.now() - lastProgressSet.getTime()))
        if (!progressBar.current) return
        progressBar.current.value = currentTimestamp
    }, [lastProgressSet, loading, songInfo.duration, songInfo.progress, songInfo.state])
    useAnimationFrame(handleTicker)
    return <AnimatePresence>
        {!loading &&
            <motion.progress initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                style={{ "--bg-color": Color(progressColor).luminosity() < 0.015 ? "white" : progressColor } as React.CSSProperties}
                className={`h-[8px] progress-filled:bg-[var(--bg-color)] progress-filled:rounded-r-full progress-unfilled:bg-[#000000AA] progress-unfilled:rounded-r-none shadow-lg ${className}`}
                ref={progressBar}
                value={loading ? undefined : songInfo.progress}
                max={songInfo.duration}></motion.progress>
        }
    </AnimatePresence >
}