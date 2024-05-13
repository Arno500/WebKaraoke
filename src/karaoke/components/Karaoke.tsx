import { AnimatePresence } from "framer-motion";
import { Lyrics } from "../types";
import Line from "./Line";
import { memo, useMemo } from "react";

const NO_LYRICS = [
    "Pas de paroles, bisous",
    "On écoute et on apprécie"
]

function Karaoke({ lyrics, index = -1, loading }: { lyrics?: Lyrics, index: number | null, loading: boolean }) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const noLyricsString = useMemo(() => NO_LYRICS[Math.floor(Math.random() * NO_LYRICS.length)], [lyrics])
    return (<div>
        <AnimatePresence mode="popLayout">
            {lyrics && index !== null && lyrics.entries[index - 2] && <Line key={index - 2} line={lyrics.entries[index - 2]} shouldBeHidden />}
            {lyrics && index !== null && lyrics.entries[index - 1] && <Line key={index - 1} line={lyrics.entries[index - 1]} />}
            {lyrics && index !== null && lyrics.entries[index] && <Line key={index} line={lyrics.entries[index]} isMain />}
            {lyrics && lyrics.entries[(index ?? -1) + 1] && <Line key={(index ?? -1) + 1} line={lyrics.entries[(index ?? -1) + 1]} />}
            {lyrics && lyrics.entries.length === 0 && <p className="text-center text-3xl">
                <span className="text-sm drop-shadow-lg bg-black bg-opacity-35 py-2 px-6 rounded-full mb-5 inline-block">Musique instrumentale</span>
                <br />
                {noLyricsString}
            </p>}
            {!lyrics && !loading && <p className="text-center text-3xl">
                <span className="text-sm drop-shadow-lg bg-red-950 bg-opacity-70 py-2 px-6 rounded-full mb-5 inline-block">Pas trouvé les paroles :/</span>
            </p>}
        </AnimatePresence>
    </div >
    )
}

export default memo(Karaoke)