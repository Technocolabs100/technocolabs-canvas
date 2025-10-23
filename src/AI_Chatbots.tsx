import React from "react";
import { PageShell, Section, BulletGrid, Pills, Pricing, Steps, CodeBlock, FAQ, StickyCTA } from "./shared";

export default function AI_Chatbots() {
  return (
    <PageShell
      title="AI Chatbot Development"
      subtitle="Product support, lead-gen, internal assistants and automations."
      icon="/icons/chatbot.svg"
      ctaLabel="Start a chatbot project"
      ctaHref="mailto:hello@technocolabs.com?subject=AI%20Chatbot%20Project"
    >
      <Section title="Use-cases">
        <BulletGrid
          items={[
            "Customer support deflection with seamless human handoff.",
            "Sales assist: website concierge, qualification, and booking.",
            "Internal self-serve: HR, IT, policy Q&A and knowledge bots.",
            "Agent assist: summarization, next-best-action, wrap-up notes.",
            "Ticket triage and classification with downstream automations.",
          ]}
        />
      </Section>

      <Section title="Channels & integrations">
        <Pills
          items={[
            "Web widget",
            "WhatsApp / SMS / Email",
            "Intercom / Zendesk / Freshdesk",
            "Slack / Teams",
            "HubSpot / Salesforce",
            "CRM/ERP/Databases via APIs",
          ]}
        />
      </Section>

      <Section title="How we deliver">
        <Steps
          steps={[
            ["Intent design", "Tasks, tone, guardrails, escalation policy."],
            ["Grounding", "Docs, KBs, product data; RAG + tools."],
            ["Automation", "Create/lookup/update tickets, CRM, orders."],
            ["Safety", "PII masks, rate limiting, jailbreak defense."],
            ["Analytics", "CSAT, containment, first-contact resolution."],
          ]}
        />
      </Section>

      <Section title="Example flow (pseudo)">
        <CodeBlock
          code={`User -> Bot
  -> Detect Intent -> { FAQ | RAG | Tool }
  -> If (High Risk) -> Human Handoff
  -> Log metrics (CSAT, CTR, Cost)`}
        />
      </Section>

      <Section title="Plans">
        <Pricing
          tiers={[
            {
              name: "Starter",
              price: "$12,000",
              blurb: "Single channel, limited intents.",
              features: ["Web widget", "RAG on your docs", "Basic analytics", "Email handoff"],
            },
            {
              name: "Growth",
              price: "$28,000",
              blurb: "Multi-channel, automation ready.",
              features: ["Zendesk/Intercom", "CRM actions", "Guardrails", "Dashboards"],
              highlight: true,
            },
            {
              name: "Enterprise",
              price: "SOW-based",
              blurb: "SLA, SSO, VPC, audits.",
              features: ["SSO/OAuth", "VPC/VNet option", "P0 SLA", "Audit trails"],
            },
          ]}
        />
      </Section>

      <Section title="FAQs">
        <FAQ
          items={[
            ["Can we keep tone on-brand?", "Yes—style prompts + tone tests + content controls per channel."],
            ["How do we prevent hallucination?", "Ground responses with citations, limit tool permissions, and run guardrail checks."],
            ["Can we use our CRM/ticketing?", "Yes. We integrate via APIs and respect rate limits and permissions."],
          ]}
        />
      </Section>

      <StickyCTA href="mailto:hello@technocolabs.com?subject=AI%20Chatbot%20Project" />
    </PageShell>
  );
}
