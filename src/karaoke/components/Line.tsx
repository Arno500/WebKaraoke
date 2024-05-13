import { motion } from "framer-motion";
import { LyricEntry } from "../types";
import { forwardRef } from "react";

function Line({ line, isMain = false, shouldBeHidden = false }: { line: LyricEntry, isMain?: boolean, shouldBeHidden?: boolean }, ref: React.Ref<HTMLDivElement>) {
    return (
        <motion.div
            layout="position"
            ref={ref}
            animate={shouldBeHidden ? { opacity: 0, y: 0 } : { opacity: isMain ? 1 : 0.2, y: 0, backgroundColor: isMain ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.0)" }}
            initial={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center my-4 py-2">
            <div className="flex flex-col items-center justify-center">
                <p className="text-center text-2xl drop-shadow-lg">{line.text !== "" ? line.text : "♪"}&nbsp;</p>
                <p className="text-center text-sm drop-shadow-lg">{line.romanized}</p>
            </div>
        </motion.div >
    )
}
export default forwardRef(Line)