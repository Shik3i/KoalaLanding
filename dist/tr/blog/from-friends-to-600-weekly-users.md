When I released [KoalaSync](https://sync.koalastuff.net) on May 22, 2026, just over two months ago, I honestly did not expect even 100 people to use it.

I mainly built it for myself and a few friends. We watch movies and binge shows together on my Emby server or Amazon Prime Video, and I really only put it on the Chrome Web Store (CWS) to make automatic updates possible.

## The growth has been surprisingly consistent

The graph looks almost suspiciously smooth, but it is real data exported from the CWS developer console.

![KoalaSync weekly users rising steadily to 637](/assets/blog/koalasync-weekly-users.webp)

As of today, KoalaSync has passed 637 weekly users on the CWS alone, plus another 50 users on Firefox! Thanks, guys. I mean it. I am really glad you are enjoying my approach to this.

That is obviously not huge compared to the popular watch party alternatives out there, but it is way bigger than I would have thought initially.

## Installs vs. uninstalls

There have been a few slower days and small drops, but so far the general direction has stayed mostly the same. KoalaSync currently averages around 21 installs and five uninstalls per day, while the current record is 30 installs in a single day.

You can look at the almost up-to-date data on [KoalaData](https://data.koalastuff.net/p/koalasync), which is also where the graphs in this article were created.

![KoalaSync daily installs and uninstalls, with installs averaging 21 and uninstalls averaging five](/assets/blog/koalasync-installs-uninstalls.webp)

I really hope the gap between installs and uninstalls will grow even further over time :D

## 10x bump in impressions

I still do not completely understand what caused the biggest change in impressions.

Someone on Reddit suggested that I should rename the extension in the Chrome Web Store so the title included an actual search keyword instead of only saying “KoalaSync.” That sounded obvious in retrospect, so I changed it to “Watch Party — KoalaSync.”

![KoalaSync Chrome Web Store impressions increasing sharply after July 21](/assets/blog/koalasync-store-impressions.webp)

Since then, the number of impressions has increased by more than ten times.

The “problem” is that the timing also lines up almost perfectly with KoalaSync receiving the CWS “Established Publisher” badge after being published for two months. So I have no idea whether the keyword helped, the badge helped, or both happened to help at the same time.

Whatever caused it, the difference is insane.

The extra impressions did not turn into ten times as many store page views, though. They did not even turn into 1.5 times as many page views.

![KoalaSync Chrome Web Store page views, with a seven-day average of 56](/assets/blog/koalasync-store-page-views.webp)

That probably means the store listing itself still needs work.

The screenshots are still based on the old blue and neon design, while KoalaSync has since moved to the newer green nature theme. Updating those is somewhere on the list.

I also submitted KoalaSync for the Featured badge around six weeks ago and have not heard anything back. I am starting to assume I might simply never hear back from them.

## Six people uninstalled because there was no chat

The newest version, v3.0.0, adds end-to-end encrypted chat directly to watch parties.

This was not originally something I wanted to build, because I did not really see the point. If you are relying on text chat, I personally do not feel like perfectly real-time synchronization is quite as important anyway, since everyone is already waiting for people to type.

I have also always found chats inside watch party tools slightly annoying. When I watch something with friends, we are usually already talking on Discord. A second chat box inside the extension just takes up space.

Apparently, not everyone agrees.

In the middle of June, I built [KoalaBye](https://bye.koalastuff.net), a very small website for collecting feedback, and used it as the uninstall URL for KoalaSync. Browser extensions can register a URL that automatically opens after someone uninstalls them.

I did not want to use Google Forms or another established form provider because I did not want to send people to a third-party service whose privacy practices I could not control.

![KoalaBye analytics showing 387 raw visits and a 9.8 percent submission rate](/assets/blog/koalabye-submission-rate.webp)

As you can see, only around 10% of the people who reached the page actually submitted the form. Of those, only around 30% also used the free-text field to explain their problem in more detail.

This is what the uninstall form looks like, in case you are curious and do not want to uninstall KoalaSync just to see it:

![KoalaSync uninstall feedback form with optional reasons and a free-text field](/assets/blog/koalabye-uninstall-form.webp)

Six different people said that the missing chat was the reason they removed the extension.

Six people is not a giant user study, but considering how few people actually submitted feedback at all, it was enough to make me reconsider my initial position.

## So now KoalaSync has chat too

It is completely optional, end-to-end encrypted, and stays out of the way for people who do not want it.

Nobody has to create an account, and opening a watch party does not suddenly cover the interface with a giant chat panel. The server does not store the encrypted messages; it just relays them, and it never sees the encryption key. The key is generated locally by the extension every time you create a new room and is shared via the invite link.

I still personally prefer voice chat, but the people who asked for text chat can finally use it. Feedback is very welcome. I cannot really judge which text-chat features are missing because I do not seriously use it myself.

## A small ecosystem appeared around one extension

I did not originally plan to build several separate services around KoalaSync. It just happened one problem at a time.

KoalaSync needed better uninstall feedback, so I built KoalaBye.

I wanted a better way to share Chrome Web Store statistics, so I built KoalaData.

I really dislike how KoalaSync, as a browser extension, has to handle YouTube, so I built [KoalaParty](https://party.koalastuff.net), a dedicated Watch2Gether alternative that is still in beta.

People kept asking for chat, so KoalaSync now has encrypted chat.

All of these projects were built mostly with Claude and Codex, plus a little bit of OpenCode and other models here and there. I still plan the features, make the decisions, test everything, and complain when the agents build something completely different from what I asked for, but most of the actual implementation is AI-assisted.

None of these projects are supposed to become giant SaaS products. They are small tools built to solve specific problems, and they are all free and open source. They will also stay free and open source.

There are no ads, no user tracking, and I am not building them to collect or sell anyone's data.

## What comes next

The immediate list is fairly boring:

- Replace the outdated CWS and Firefox screenshots
- Fix the first bugs people will inevitably find in the new chat
- Improve support for websites with unusual video players
- Keep KoalaData reasonably up to date
- Continue going through the feedback submitted through KoalaBye

I am also curious whether the growth will continue or eventually flatten out.

For now, 637 weekly users is already far beyond the original goal of “make something that works for me and my friends.”

Thanks to everyone who tried it, reported a bug, suggested a feature, translated something, or told me when an idea was bad.

Contributions, issues, questions, and feedback on [GitHub](https://github.com/Shik3i/KoalaSync) are very much welcome.