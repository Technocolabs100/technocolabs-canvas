import React from "react";
import { PageShell, Section, BulletGrid, Pills, Pricing, Steps, CodeBlock, FAQ, StickyCTA } from "./shared";

export default function GenerativeAI() {
  return (
    <PageShell
      title="Generative AI"
      subtitle="RAG, guardrails, fine-tuning, evaluation and cost control."
      icon="/icons/generative-ai.svg"
      ctaLabel="Plan a GenAI pilot"
      ctaHref="mailto:hello@technocolabs.com?subject=Generative%20AI%20Pilot"
    >
      <Section title="Solutions we build">
        <BulletGrid
          items={[
            "Retrieval-augmented generation (RAG) with evals & observability.",
            "Knowledge assistants for support, sales, HR and engineering.",
            "Document intelligence: ingestion, chunking, enrichment, grounding.",
            "Workflow automation with tool-use, function calling, and agents.",
            "Safety & governance: redaction, allow/deny lists, jailbreak defense.",
            "Latency & cost optimization with caching, routing, and distillation.",
          ]}
        />
      </Section>

      <Section title="Tech stack">
        <Pills
          items={[
            "OpenAI / Claude / Llama / Mixtral",
            "LangChain / LangGraph / LlamaIndex",
            "Vector DB: Pinecone / Weaviate / FAISS",
            "Warehouse: Snowflake / BigQuery / Delta",
            "Observability: LangFuse / PromptLayer",
            "Guardrails: Guidance / Rebuff / Azure Safety",
          ]}
        />
      </Section>

      <Section title="Pilot to production">
        <Steps
          steps={[
            ["Problem framing", "User stories, risks, success metrics."],
            ["Data prep", "Connectors, chunking, embeddings, eval datasets."],
            ["Prototype", "RAG + tools + UI; human evals and traces."],
            ["Hardening", "Guardrails, cost, latency, monitoring, rollback."],
            ["Scale", "SLAs, CI/CD, infra-as-code, multi-model routing."],
          ]}
        />
      </Section>

      <Section title="Sample orchestration (LangGraph-style)">
        <CodeBlock
          code={`START -> Retrieve -> Ground -> Plan
 -> {CallTools | QueryLLM}
 -> Validate -> (Retry | STOP)`}
        />
      </Section>

      <Section title="Engagement models">
        <Pricing
          tiers={[
            {
              name: "Pilot (4 weeks)",
              price: "$25,000",
              blurb: "One UX + one use-case to decision.",
              features: ["RAG or Tool-use prototype", "Evals + observability", "Security review", "Rollout plan"],
              highlight: true,
            },
            {
              name: "Production (8–12 weeks)",
              price: "SOW-based",
              blurb: "Hardened app with dashboards and SLAs.",
              features: ["Guardrails + policies", "Cost/latency optimizing", "CI/CD + IaC", "Support & training"],
            },
            {
              name: "Enablement",
              price: "$6,000 / wk",
              blurb: "Side-by-side pairing with your team.",
              features: ["Architecture reviews", "Evals & datasets", "Model/vendor strategy", "Security governance"],
            },
          ]}
        />
      </Section>

      <Section title="FAQs">
        <FAQ
          items={[
            ["Why not fine-tune first?", "We start with RAG + prompts for speed and control; fine-tune only where it proves ROI (style, safety, domain)."],
            ["Will it leak data?", "We enforce zero-data retention vendors, redact PII, and can deploy fully within your VPC."],
            ["How do we measure quality?", "Offline eval sets + online feedback, cost/latency dashboards, and guardrail audits."],
          ]}
        />
      </Section>

      <StickyCTA href="mailto:hello@technocolabs.com?subject=Generative%20AI%20Pilot" />
    </PageShell>
  );
}
