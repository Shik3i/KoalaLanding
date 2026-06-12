I recently added a new feature to my browser extension [KoalaSync](https://sync.koalastuff.net): a local audio compressor for browser videos.

It is still a bit experimental and will probably change over time, but I wanted to write down what I built, why I built it, and what ended up being more annoying than expected.

KoalaSync is mostly a watch party extension. It syncs play, pause and seeking between people watching videos together in the browser.

But the new compressor is useful even when you are watching alone, because modern movie audio can be ridiculous.

One minute the dialogue is so quiet that I turn the volume up.
Thirty seconds later an explosion tries to kill my headphones.

I mostly watch movies from my Emby server with friends, and I got tired of constantly adjusting the volume. VLC has had audio compression for ages. Some TVs have a "night mode". But in the browser, you usually just get the raw audio mix from the video element.

So I wanted to see if I could build something similar directly into the extension.

---

## The Basic Idea

The browser already has most of what I needed: the Web Audio API.

More specifically, `DynamicsCompressorNode`.

It all runs locally in the browser, with no separate audio service involved.

The simplest version looks something like this:

```js
const ctx = new AudioContext();
const src = ctx.createMediaElementSource(videoElement);
const compressor = ctx.createDynamicsCompressor();

compressor.threshold.value = -24;
compressor.ratio.value = 8;
compressor.knee.value = 15;
compressor.attack.value = 0.010;
compressor.release.value = 0.300;

src.connect(compressor);
compressor.connect(ctx.destination);
```

That takes the audio from a video element, runs it through a compressor, and sends it to the speakers.

That part was honestly not the hard part.

---

## The Annoying Part: Switching It On Without Pops

The compressor node itself is easy.

Making it feel usable inside a browser extension was more annoying.

I did not want the audio to pop when enabling or disabling the compressor. A hard switch between the original signal and the compressed signal can sound pretty bad, especially when you toggle it while something is already playing.

So I ended up using a dry/wet setup:

* dry path: original audio
* wet path: compressed audio

When the compressor turns on, the dry signal fades out and the compressed signal fades in. When it turns off, the same thing happens in reverse.

The actual implementation wraps this in a small [`rampGain`](https://github.com/Shik3i/KoalaSync/blob/main/extension/content.js#L231-L236) helper that cancels scheduled values first:

```js
function rampGain(node, value, t) {
    const current = node.gain.value;
    node.gain.cancelScheduledValues(t);
    node.gain.setValueAtTime(current, t);
    node.gain.linearRampToValueAtTime(value, t + 0.04);
}
```

It is just a tiny 40ms ramp, but it makes the toggle feel much less rough.

---

## Per-Video Audio Chains

Another thing I had to deal with: pages can have more than one video element.

And video elements can disappear when:

* you navigate
* a new episode loads
* the player re-renders itself
* the site swaps one media element for another

So each video element gets its own audio chain.

I cache those chains in a [`WeakMap`](https://github.com/Shik3i/KoalaSync/blob/main/extension/content.js#L156), so when the video element disappears, the browser can clean up the related chain as well.

```js
const audioChains = new WeakMap();

function setupAudioChain(videoEl) {
    if (audioChains.has(videoEl)) return audioChains.get(videoEl);

    // ... create source, compressor, dryGain, compGain

    const chain = { compressor, dryGain, compGain, active: false };
    audioChains.set(videoEl, chain);

    return chain;
}
```

The full [`setupAudioChain`](https://github.com/Shik3i/KoalaSync/blob/main/extension/content.js#L201-L229) also creates the dry/wet gain nodes and connects everything.

This is one of those things where the idea is simple, but browser pages are messy enough that it still takes some care.

---

## Presets Instead of Only Sliders

I did not want users to open the feature and immediately stare at five audio parameters.

So I added a few [presets](https://github.com/Shik3i/KoalaSync/blob/main/extension/content.js#L140-L146):

| Preset            | Threshold | Ratio | Attack | Release | Knee  |
| ----------------- | --------- | ----- | ------ | ------- | ----- |
| Recommended       | -24 dB    | 8:1   | 10 ms  | 300 ms  | 15 dB |
| Dynamic Range     | -18 dB    | 4:1   | 20 ms  | 200 ms  | 10 dB |
| Vocal Enhancement | -12 dB    | 3:1   | 15 ms  | 150 ms  | 5 dB  |
| Smooth            | -30 dB    | 1.5:1 | 30 ms  | 250 ms  | 20 dB |

The default is currently "Recommended".

It is not meant to be perfect. It just tries to make dialogue easier to hear without completely destroying the sound of action scenes.

There is also a custom mode where you can tweak threshold, ratio, attack, release and knee manually.

---

## Moving Settings Out of the Popup

This was also the first time I added a proper internal extension page to KoalaSync.

Before this, most settings lived inside the extension popup. That works fine for small toggles, but it gets annoying fast once you want sliders, presets, explanations and maybe more audio tools later.

So the audio processing UI now opens in its own full tab at [`audio-options.html`](https://github.com/Shik3i/KoalaSync/blob/main/extension/audio-options.html).

That gives me much more space to work with, and it also leaves room for future features like an equalizer or other audio processing options.

The popup is still fine for quick actions.
But for anything that needs actual adjustment, a full page feels much better.

This was one of those "small feature" changes that quietly turned into a UI decision too.

---

## Where It Works

The short version: it works best when KoalaSync can access the page's video element.

That covers a lot of normal browser playback: self-hosted media servers, many video sites, and some major streaming platforms.

There are still edge cases. Some sites use unusual player setups, strict DRM implementations, embedded playback restrictions, or browser-specific behavior that prevents audio processing.

When that happens, KoalaSync just leaves the audio unchanged instead of trying to force anything.

---

## Is This Feature Finished?

Not really.

It works, and I already find it useful, but I still consider it experimental.

Things I might change or add later:

* better presets
* per-site behavior
* equalizer support
* better UI explanations
* maybe a simple "night mode" toggle for people who do not care about compressor settings

For now, I mostly wanted something that solves the annoying "quiet dialogue, loud explosions" problem without needing another app or external audio tool.

---

## Links

KoalaSync is free and open source.

* Website: https://sync.koalastuff.net
* GitHub: https://github.com/Shik3i/KoalaSync

The relevant parts are mostly in [`extension/content.js`](https://github.com/Shik3i/KoalaSync/blob/main/extension/content.js#L140-L229) and [`extension/audio-options.html`](https://github.com/Shik3i/KoalaSync/blob/main/extension/audio-options.html) if you want to look at the implementation.

I am curious if anyone else has built audio processing features inside browser extensions before. The Web Audio API is pretty nice once it works, but browser/player edge cases are definitely a thing.