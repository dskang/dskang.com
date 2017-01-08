---
title: My New Baby
date: 2012-08-30
tags:
---

Replicating my setup on a new machine is always a fun experience.

Before installing anything, I swapped the caps lock and control keys since I use a lot of keyboard shortcuts that uses ctrl and I don’t want to get RSI anytime soon.

A list of all the programs that I installed (in chronological order):

- Google Chrome
- MacVim
- Alfred
- Divvy
- iTerm
- Xcode
- Dropbox
- Evernote

After getting through all the apps, I installed Homebrew and used my dotfiles to get all my settings and configuration set up. Really glad I put my dotfiles on GitHub.

Some observations I made while going through this entire process:

- I dislike that the Applications folder is not in the dock by default in Mountain Lion. I had to drag it over to the dock from Finder so that I can drag my newly installed applications to the Applications directory. How do other people do this?
- Not being able to sync Chrome to my Google account immediately due to having to generate an application specific password was a bit annoying, but completely understandable. What wasn’t understandable was how a popup came up when I signed into Gmail asking me if I wanted to sync Chrome to that Google account. It simply worked without having to generate an application specific password. What the hell?
- The Mac App Store wouldn’t let me look at the Purchases section for some strange reason; it kept telling me that I needed an Internet connection:

    ![my-new-baby-1](blog/my-new-baby-1.png)

    To make matters worse, there was no visual indication of which apps I had already purchased and which apps I had not. When I went to install Divvy, I was given the impression that I had to purchase the app again:

    ![my-new-baby-2](blog/my-new-baby-2.png)

    Upon trying to install it and not knowing whether I would be charged $13.99 again, I was presented with a message saying that the update is free:

    ![my-new-baby-3](blog/my-new-baby-3.png)

    Oh hey, that information would be nice to surface to the user without making them click the “Buy App” button.
- Xcode tries to download the Command Line Tools in one go. Meaning that if you’re disconnected from the network in the middle of the download, you’re completely out of luck. This would be understandable if it were a small download, but the Command Line Tools is a whopping 115 MB! I involuntarily restarted the download three times before actually downloading it to completion because I kept moving around and didn’t realize what was going on.

    ![my-new-baby-4](blog/my-new-baby-4.png)

- I miss being able to see the time left on the battery in the battery icon itself.

Besides the pretty minor inconveniences mostly due to Apple’s screw-ups, everything went pretty smoothly. I’m extremely pleased with being able to use a MacBook Air again and look forward to doing some serious coding with it.
