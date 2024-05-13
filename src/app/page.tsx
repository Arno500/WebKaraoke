"use client";
import Karaoke from "@/karaoke/components/Karaoke";
import ProgressBar from "@/karaoke/components/ProgressBar";
import { getLyricsAndMeta } from "@/karaoke/dbMultiplexer";
import { Lyrics, SongInfo } from "@/karaoke/types";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, useAnimationFrame, motion } from "framer-motion";
import { average } from 'color.js';

const SYNCHRONIZATION_MARGIN = 1000

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true)

  const [songInfo, setSongInfo] = useState<SongInfo>({})

  const [imageSrc, setImageSrc] = useState<string>()
  const [dominantColor, setDominantColor] = useState<string>()

  const [lyrics, setLyrics] = useState<Lyrics>()
  const [index, setIndex] = useState<number | null>(null)
  const [lastProgressSet, setLastProgressSet] = useState<Date>()

  const updateSongInfo = useCallback((data: SongInfo) => {
    setSongInfo(data)
  }, [])
  useEffect(() => {
    if (!songInfo.artist || !songInfo.title || !songInfo.duration) return
    const func = async () => {
      setLoading(true)
      const lyricsAndMeta = await getLyricsAndMeta(songInfo)
      setLyrics(lyricsAndMeta?.lyrics)
      setImageSrc(lyricsAndMeta?.metadata?.cover)
      setLoading(false)
    }
    func()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songInfo.artist, songInfo.title, songInfo.duration])
  useEffect(() => {
    (window as any).updateSongInfo = updateSongInfo
  }, [updateSongInfo])
  useEffect(() => {
    setLastProgressSet(new Date())
  }, [songInfo])
  useEffect(() => {
    setIndex(null)
  }, [songInfo.album, songInfo.artist, songInfo.title])
  useEffect(() => {
    const func = async () => {
      if (!imageSrc) return
      const extractParams = { amount: 1, format: "hex", sample: 40, group: 5 }
      const color = await average(imageSrc, extractParams) as string
      setDominantColor(color)
    }
    func()
  }, [imageSrc])
  const followSong = useCallback(() => {
    if (!lyrics || songInfo.progress == null || !lastProgressSet || songInfo.state !== "playing") return
    const currentTimestamp = (songInfo.progress + (Date.now() - lastProgressSet?.getTime())) + SYNCHRONIZATION_MARGIN
    let finalIndex = index ?? -1
    if (index && (index >= lyrics.entries.length || lyrics.entries[index].time > currentTimestamp)) {
      finalIndex = -1
    }
    while (finalIndex < lyrics.entries.length - 1 && lyrics.entries[finalIndex + 1].time < currentTimestamp) {
      finalIndex++
    }
    setIndex(finalIndex >= 0 ? finalIndex : null)
  }, [index, lastProgressSet, lyrics, songInfo.progress, songInfo.state])
  useAnimationFrame(followSong)
  console.log(songInfo, lyrics, index, songInfo, dominantColor)
  return (
    <main className="relative h-full w-full p-6">
      {      // eslint-disable-next-line @next/next/no-img-element
      }      <img className="fixed h-full w-full top-0 left-0 object-cover -z-10 blur-3xl brightness-75" alt="" src={imageSrc} />
      <AnimatePresence mode="popLayout">
        {loading && <motion.p className="absolute top-3 left-1/2 text-xs rounded-full bg-gray-700 bg-opacity-75 px-4 py-1" animate={{ opacity: 1, y: 0, x: "-50%" }} initial={{ opacity: 0, y: "-100%", x: "-50%" }} exit={{ opacity: 0, y: "-100%", x: "-50%" }}>Loading...</motion.p>}
      </AnimatePresence>
      {songInfo.title && <motion.p className="text-center font-semibold">{songInfo.title} - {songInfo.artist}</motion.p>}
      <div className="absolute w-full top-2/4 left-2/4 -translate-x-1/2 -translate-y-[60%]">
        <Karaoke lyrics={lyrics} index={index} loading={loading} />
      </div>
      <ProgressBar songInfo={songInfo} lastProgressSet={lastProgressSet} loading={loading} progressColor={dominantColor} className="w-full fixed bottom-0 left-0" />
    </main>
  );
}
