// ==UserScript==
// @name         Publish YTMusic state
// @namespace    http://tampermonkey.net/
// @version      2024-04-07
// @description  emit events cross tab to export songs informations from YouTube Music
// @author       You
// @match        https://music.youtube.com/*
// @match        http://localhost:3000/*
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

const KEY_NAME = "ytMusicState"

function updateSongInfo(args) {
    if (unsafeWindow.updateSongInfo) {
        console.debug("Will update song info (from the Tampermonkey script of WebKaraoke)")
        unsafeWindow.updateSongInfo(args)
    }
}

function updateProgress(forceState) {
    console.debug("Pushing video state update (from the Tampermonkey script of WebKaraoke)")
    const progressBarElm = document.querySelector("#progress-bar tp-yt-paper-progress")
    GM_setValue(KEY_NAME, {
        album: window.navigator.mediaSession.metadata.album,
        artist: window.navigator.mediaSession.metadata.artist,
        title: window.navigator.mediaSession.metadata.title,
        cover: window.navigator.mediaSession.metadata.artwork[window.navigator.mediaSession.metadata.artwork.length - 1],
        progress: progressBarElm.getAttribute("value") * 1000,
        duration: progressBarElm.getAttribute("aria-valuemax") * 1000,
        state: forceState || window.navigator.mediaSession.playbackState
    })
}

window.addEventListener('load', function () {
    'use strict';
    console.log("Starting metadata exfiltration script (from the Tampermonkey script of WebKaraoke)")
    if (window.origin === "https://music.youtube.com") {
        console.log("On YouTube Music, updating progress data (from the Tampermonkey script of WebKaraoke)")
        const video = document.querySelector("video")
        video.addEventListener("progress", evt => updateProgress())
        video.addEventListener("play", evt => updateProgress("playing"))
        video.addEventListener("pause", evt => updateProgress("paused"))
        video.addEventListener("seeked", evt => updateProgress())
    } else {
        GM_addValueChangeListener(KEY_NAME, (key, oldValue, newValue, remote) => {
            console.debug("Received new data: ", newValue, " (from the Tampermonkey script of WebKaraoke)")
            updateSongInfo(newValue)
        })
    }
});