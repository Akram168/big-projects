"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const RULES = [
  {
    title: "Be welcoming, respectful, and help keep the server safe and fun!",
    desc: "It's okay to just be a silent, lowkey player — but keep it respectful and kind if otherwise. We'd love for new and returning players to feel welcome, almost like they're coming back to a second home. That also means protecting it and our growing community: see something, say something. We're here to help — sorting tickets, giving resources, or whatever else.",
  },
  {
    title: "Keep chats, media, names, avatars, builds, and behaviors appropriate for everyone.",
    desc: "We all have different humors and personalities, but you never know who or what mindset is on the other side of whatever you do online. There's a place for everything, but here will be appropriate and respectful. This also means keeping yourself safe — don't share any information you wouldn't with a total stranger on the street.",
  },
  {
    title: "No links, advertising, self-promotion, or server mentions not directly approved by server owners.",
    desc: "Unless it's ChaosCraft related and approved by us, links or promos won't be posted here. If it's a server suggestion, make one in the suggestion channel or make a ticket.",
  },
  {
    title: "No spamming chats or unneeded pings.",
    desc: "Someone will see your message, even if it takes a bit. Spamming just makes everything else get lost in a community chat. Unless it's an emergency, let's not ping either — if someone's not online, they're just not online.",
  },
  {
    title: "No hacking, abusing bugs or problems, scamming, or doing anything to hurt the server or its economy.",
    desc: "Keep it fair and fun. If something's broken or buggy, put in a ticket — don't abuse it or tell everyone about it (most problems reported = rewards and brownie points anyway). This also covers anything that hurts or drastically changes the server or its economy: overpricing items, abusing an unchecked money-making method, hacking to gain or hurt anything, etc.",
  },
  {
    title: "Zero tolerance policy on inappropriate behavior, harassment, doxing, blackmailing, threatening, being hateful towards any person, and inappropriate DMs.",
    desc: "This is self explanatory. Anyone found doing any of these things — or anything similar — will be permanently banned from ChaosCraft. If you see, experience, or know of anyone breaking this rule, please open a ticket or message a staff member on Discord and it will be taken care of.",
  },
  {
    title: "Rules are subject to change, and the decision to warn, mute, timeout, or ban is up to staff.",
    desc: "",
  },
];

export function Rules() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="pt-20 pb-24 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--brand-soft)] mb-3">Discord & Minecraft</p>
          <h1 className="font-display font-bold leading-tight mb-4" style={{ fontSize: "clamp(2.2rem,6vw,3.5rem)" }}>
            Rules
          </h1>
          <p className="text-[var(--text-mute)] max-w-xl mx-auto leading-relaxed">
            We want this to be a fun, enjoyable, and safe place for everyone and every vibe while running smoothly.
            These apply on both Discord and the Minecraft server — Chaos Mode will be slightly different.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {RULES.map((rule, i) => (
            <motion.div key={rule.title} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * .06, duration: .4 }}
              className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold"
                  style={{ background: "rgba(147,51,234,.15)", color: "var(--brand-soft)" }}>
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display font-semibold text-base mb-1.5">{rule.title}</h3>
                  {rule.desc && <p className="text-sm text-[var(--text-mute)] leading-relaxed">{rule.desc}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .6 }}
          className="text-center text-sm text-[var(--text-mute)] mt-10">
          Thank you to everyone for helping keep the server running smoothly and a fun, safe space — above all. 💜
        </motion.p>
      </div>
    </section>
  );
}
