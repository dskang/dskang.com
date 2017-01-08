---
title: Dead Simple Email Collection
date: 2012-09-08
tags:
---

Recently, I set out to add an email collection form on the splash page for [Bemo](http://www.bemoapp.com/), a mobile app I’ve been working on. I wanted people to be able to submit their email addresses so that they can be notified when the app is ready to be downloaded. This is a commonly used tactic, so I was pretty surprised that I couldn’t find any prepackaged solutions for this. Well, except for LaunchRock.

For the uninitiated, [LaunchRock](https://www.launchrock.com/) allows you to set up a “Coming Soon” page in just a couple minutes. To be honest, I don’t think people should use LaunchRock to advertise a product that they’re making. The problem is that, while LaunchRock pages look very pretty, they don’t provide enough information for me to want to just give away my email address. Oftentimes, I have no idea what the product is even going to do. It would be great if LaunchRock provided an embeddable version that allowed you to include a signup form anywhere on your marketing website, but they don’t. So I decided to build a generic solution that anyone can use.

Enter [Email Bin](https://github.com/dskang/email-bin). Email Bin is a simple Flask application that allows you to collect emails from your potential users without writing any code. It should be dead simple to create a splash page so that you can gauge interest for your app/website/book/etc. That’s exactly what [Joel from Buffer app did](https://blog.bufferapp.com/idea-to-paying-customers-in-7-weeks-how-we-did-it) before even building Buffer, and I think it’s a great way to validate your idea. The email collection is often the only component requiring server-side code in an otherwise completely static web site, and I think that it presents enough of a hurdle that there should be a prepackaged solution to it.

- **Email collection is not hard to write. Why did you do this?**  
I think there are enough developers and designers who would rather focus on building a sweet landing page or an MVP than spend time writing a script to save emails to a database. Also, let’s not forget about the nontechnical folks who would also benefit from being able to validate their ideas and collect signups.

- **How is this different from LaunchRock?**  
LaunchRock gives you a simple page to collect email addresses, but that’s all you can have. If you would like to embed a form to collect email addresses on your own landing page, you’ll have to roll your own solution. Or you can use Email Bin.

- **Where do I find it again?**  
On [GitHub](https://github.com/dskang/email-bin), my friend. Pull requests are welcome.
