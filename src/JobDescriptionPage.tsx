// JobDescriptionPage.tsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type RoleKey =
  | "genai"
  | "bi"
  | "cv"
  | "da"
  | "ds"
  | "dl"
  | "web"
  | "ml"
  | "py";

type RoleDetail = {
  title: string;
  overview: string;
  responsibilities: string[];
  required: string[];
  preferred?: string[];
  perks: string[];
  learningOutcomes: string[];
  evaluation: string[];
  tech: string[];
  logistics: string[];
  sampleProjects: string[];
};

// mapping from slug (roleId) to the pretty role name used by the internship form
const ROLE_PRETTY: Record<string, string> = {
  genai: "AI Engineer",
  bi: "Business Intelligence Developer",
  cv: "Computer Vision Engineer",
  da: "Data Analyst",
  ds: "Data Scientist",
  dl: "Deep Learning Engineer",
  web: "Full Stack Developer",
  ml: "Machine Learning Engineer",
  py: "Python Developer",
};

const ROLES: Record<RoleKey, RoleDetail> = {
  genai: {
    title: "Generative AI Engineer Intern",
    overview:
      "Join the Generative AI squad to build prototype and production-ready features powered by large language models and multimodal systems. You’ll be working on fine-tuning, prompt design, evaluation pipelines, and integrating models into APIs or UIs that deliver value for enterprise users.",
    responsibilities: [
      "Fine-tune transformer models and maintain experiment reproducibility.",
      "Design and evaluate prompt families and generation constraints.",
      "Implement retrieval augmented generation (RAG) pipelines and embedding stores.",
      "Integrate inference into prototypes (APIs, demo UIs) and measure latency/throughput.",
      "Write automated evaluation suites (BLEU/ROUGE/semantic metrics/custom tests).",
    ],
    required: [
      "Proficient in Python and comfortable with PyTorch or TensorFlow.",
      "Working knowledge of transformer architectures and tokenization.",
      "Experience running ML experiments and logging results.",
    ],
    preferred: [
      "Familiarity with Hugging Face Transformers, PEFT/LoRA, or RLHF concepts.",
      "Experience with vector databases (FAISS, Milvus) or RAG patterns.",
      "Knowledge of model safety/mitigation techniques.",
    ],
    perks: [
      "Mentorship by research & ML engineers",
      "Stipend for eligible interns",
      "Certificate and code demo for portfolio",
      "Potential to contribute to shipped product features",
    ],
    learningOutcomes: [
      "Understand the end-to-end lifecycle of LLM features (data → fine-tune → evaluate → deploy).",
      "Hands-on experience with prompt design and automated evaluation.",
      "Ability to measure trade-offs between model quality, cost, and latency.",
    ],
    evaluation: [
      "Short technical assignment: fine-tune or prompt-tune a small model and report metrics.",
      "1–2 interviews: technical discussion + product alignment.",
      "Final review of prototype demo and code quality.",
    ],
    tech: ["Python", "PyTorch", "Hugging Face Transformers", "Docker", "FastAPI", "FAISS", "AWS/GCP"],
    logistics: [
      "Duration: 8 weeks (typical)",
      "Mode: Remote (with occasional optional sync meetings)",
      "Time: Part-time (20–30 hrs/week) typical; discuss availability during apply",
    ],
    sampleProjects: [
      "Build a RAG prototype that answers product FAQs with context retrieval.",
      "Fine-tune a small LLM for a domain-specific summarization task and produce an evaluation report.",
    ],
  },

  bi: {
    title: "Business Intelligence Developer Intern",
    overview:
      "Work with analytics and product teams to turn raw data into clear, reliable dashboards and semantic models that drive business decisions. You will design ETL transformations, build dashboards, and collaborate on SLAs for key metrics.",
    responsibilities: [
      "Design dimensional models and maintain a metrics layer (semantic model).",
      "Implement ETL/ELT queries for near-real-time reporting.",
      "Build interactive dashboards and scheduled reports for stakeholders.",
      "Optimize queries and advise on data partitioning / cost-efficient queries.",
    ],
    required: [
      "Strong SQL skills and experience with at least one BI tool (Looker/Tableau/PowerBI).",
      "Familiarity with data warehousing concepts (star schema, slowly changing dimensions).",
      "Analytical mindset and ability to translate business questions into metrics.",
    ],
    preferred: ["Experience with dbt or semantic modeling tools", "Exposure to cloud warehouses (BigQuery/Snowflake)"],
    perks: [
      "Mentorship from senior analytics engineers",
      "Exposure to product & leadership stakeholders",
      "Portfolio-ready dashboards and metric design examples",
    ],
    learningOutcomes: [
      "Ship a dashboard from question → data model → dashboard and learn monitoring/alerting for data quality.",
      "Be able to write performant SQL for production reporting.",
    ],
    evaluation: [
      "Short SQL assignment (data transformation + dashboard mockup).",
      "Behavioural interview and a walkthrough of past analysis (if available).",
    ],
    tech: ["SQL", "dbt", "Looker/Tableau/PowerBI", "BigQuery/Postgres", "Git"],
    logistics: [
      "Duration: 8 weeks",
      "Mode: Remote",
      "Commitment: ~20–30 hrs/week",
    ],
    sampleProjects: [
      "Create a monthly retention dashboard with cohort analysis and automated alerts.",
      "Model a semantic metrics layer that enables product self-serve analytics.",
    ],
  },

  cv: {
    title: "Computer Vision Engineer Intern",
    overview:
      "Contribute to building and optimizing computer vision models for detection, segmentation and real-time inference. You'll work across dataset curation, model training, evaluation, and inference optimizations for cloud/edge deployment.",
    responsibilities: [
      "Prepare and augment datasets, implement data pipelines and labels QC.",
      "Train and fine-tune detection/segmentation models and evaluate results.",
      "Optimize models for inference (ONNX export, quantization) with latency targets.",
      "Work with engineers to integrate models into demo pipelines or APIs.",
    ],
    required: [
      "Hands-on experience with Python and PyTorch/TensorFlow and OpenCV.",
      "Understanding of object detection/segmentation workflows and metrics (mAP, IoU).",
      "Comfort with data augmentation and dataset versioning.",
    ],
    preferred: ["Familiarity with model optimization tools (ONNX, TensorRT) and edge inference considerations"],
    perks: [
      "Work on real CV datasets and deliver a deployable demo",
      "Mentorship from senior CV engineers",
      "Resume-ready project with performance analysis",
    ],
    learningOutcomes: [
      "Master training/validation cycles for CV tasks and measure production metrics.",
      "Learn inference export and optimization strategies for latency-sensitive applications.",
    ],
    evaluation: [
      "Practical task: train/finetune a detector on a small dataset and report results.",
      "Technical interview focused on CV concepts and trade-offs.",
    ],
    tech: ["Python", "PyTorch", "OpenCV", "Detectron/YOLO", "ONNX", "Docker"],
    logistics: [
      "Duration: 8 weeks",
      "Mode: Remote (possible on-site for hardware-specific tasks)",
      "Commitment: 20–30 hrs/week typical",
    ],
    sampleProjects: [
      "Build a lightweight object detection pipeline for quality inspection and measure latency vs accuracy.",
      "Design and implement a data augmentation strategy to improve rare-class detection.",
    ],
  },

  da: {
    title: "Data Analyst Intern",
    overview:
      "As a Data Analyst intern you will dig into datasets to extract actionable insights for product and marketing teams, build dashboards, and operationalize routine reporting tasks.",
    responsibilities: [
      "Perform exploratory and diagnostic analysis to answer business questions.",
      "Create and maintain dashboards and scheduled reports.",
      "Design repeatable queries and automate recurring reports/alerts.",
    ],
    required: [
      "Strong SQL skills and data manipulation experience (pandas or equivalent).",
      "Comfort creating clear visualizations and telling a data-driven story.",
      "Good communication with non-technical stakeholders.",
    ],
    preferred: ["Experience with one BI tool (Tableau/PowerBI) and basic statistical knowledge"],
    perks: [
      "Direct influence on product decisions",
      "Mentorship from analytics team",
      "Portfolio-ready dashboards and documented analyses",
    ],
    learningOutcomes: [
      "Translate product/marketing questions into data experiments and dashboards.",
      "Automate reports and implement simple monitoring for key metrics.",
    ],
    evaluation: [
      "SQL/data task and a short presentation of findings.",
      "Behavioural interview to assess communication and impact orientation.",
    ],
    tech: ["SQL", "Python (pandas)", "Tableau/PowerBI", "Excel/Sheets"],
    logistics: [
      "Duration: 8 weeks",
      "Mode: Remote",
      "Commitment: ~15–30 hrs/week",
    ],
    sampleProjects: [
      "Build a marketing funnel dashboard and propose two optimizations based on data.",
      "Automate weekly business health metrics with alerts for anomalies.",
    ],
  },

  ds: {
    title: "Data Scientist Intern",
    overview:
      "Work on building and evaluating predictive models and experiments that directly inform product choices. You’ll run experiments end-to-end from framing to prototyping and communicating impact.",
    responsibilities: [
      "Design experiments and build ML prototypes for product problems.",
      "Perform feature engineering, model selection and evaluation.",
      "Collaborate with product and engineering to propose product changes backed by data.",
    ],
    required: [
      "Strong foundation in statistics and machine learning fundamentals.",
      "Experience with Python, pandas and scikit-learn; familiarity with PyTorch is a plus.",
      "Ability to design experiments and reason about causal impact.",
    ],
    preferred: ["Experience with A/B testing frameworks or causal inference techniques"],
    perks: [
      "Ownership of end-to-end experiments",
      "Mentorship from applied data scientists",
      "Portfolio-ready modeling project",
    ],
    learningOutcomes: [
      "Design and evaluate models in production contexts and measure business metrics.",
      "Translate model outputs into product decisions and measurable KPI improvements.",
    ],
    evaluation: [
      "Modeling take-home (small dataset, produce model + evaluation report).",
      "Technical interview on ML concepts and experiment design.",
    ],
    tech: ["Python", "pandas", "scikit-learn", "PyTorch", "Jupyter", "MLflow"],
    logistics: [
      "Duration: 8 weeks",
      "Mode: Remote",
      "Commitment: ~20–30 hrs/week",
    ],
    sampleProjects: [
      "Prototype a churn-prediction model and outline an operational plan to monitor model degradation.",
      "Build a feature-ranking analysis to guide product prioritization.",
    ],
  },

  dl: {
    title: "Deep Learning Engineer Intern",
    overview:
      "Tackle deep learning engineering problems across vision and NLP: model architecture experiments, training pipelines at scale, and production-ready optimization.",
    responsibilities: [
      "Implement model architectures and training experiments.",
      "Tune training schedules and optimization techniques (mixed precision, schedulers).",
      "Collaborate with infra to scale training and deploy models reproducibly.",
    ],
    required: [
      "Practical experience with PyTorch or TensorFlow and familiarity with GPU workflows.",
      "Knowledge of optimization techniques and training stability.",
      "Comfort using experiment tracking tools (W&B, MLflow) and reproducible pipelines.",
    ],
    preferred: ["Experience with distributed training, mixed-precision, or model parallelism"],
    perks: [
      "Hands-on work with large models and training infra",
      "MLOps and productionization mentorship",
      "Stipend + certificate",
    ],
    learningOutcomes: [
      "Understand model training trade-offs and how to scale experiments.",
      "Learn techniques for reproducible deep learning pipelines and monitoring.",
    ],
    evaluation: [
      "Technical task: implement or reproduce a published model variant and report differences.",
      "Interview focusing on optimization and training decisions.",
    ],
    tech: ["PyTorch", "TensorFlow", "CUDA", "W&B/MLflow", "Docker"],
    logistics: [
      "Duration: 8 weeks",
      "Mode: Remote",
      "Commitment: 20–40 hrs/week depending on assignment",
    ],
    sampleProjects: [
      "Implement mixed-precision training and measure speed/accuracy tradeoffs on a benchmark dataset.",
      "Reproduce and adapt a small research model for an applied product metric.",
    ],
  },

  web: {
    title: "Full Stack Developer Intern",
    overview:
      "Ship end-to-end features: design UI components, implement backend APIs and ensure data workflows and tests are in place. Great role if you want to own product features from frontend to backend.",
    responsibilities: [
      "Build responsive UI components and client-side routing (React/TypeScript).",
      "Design backend endpoints and DB schemas; implement authentication & authorization flows.",
      "Write tests, setup CI checks and participate in code reviews.",
    ],
    required: [
      "Good grasp of JavaScript/TypeScript and React ecosystem.",
      "Experience with backend development (Node.js/Express, FastAPI, or similar).",
      "Basic relational DB knowledge and REST API design.",
    ],
    preferred: ["Familiarity with serverless/deployment platforms (Vercel, Netlify) and GraphQL"],
    perks: [
      "End-to-end product ownership",
      "Mentorship across frontend + backend",
      "Opportunity to ship production features",
    ],
    learningOutcomes: [
      "Ship production-ready features including tests, CI/CD and monitoring.",
      "Learn API design and how frontend/backend interact at scale.",
    ],
    evaluation: [
      "Small take-home: implement a fullstack mini-feature with tests and a README.",
      "Pairing or system-design style interview focusing on trade-offs.",
    ],
    tech: ["React", "TypeScript", "Node.js", "Postgres", "Docker", "Vercel/Netlify"],
    logistics: [
      "Duration: 8 weeks",
      "Mode: Remote",
      "Commitment: ~20–30 hrs/week",
    ],
    sampleProjects: [
      "Build a small feature where users submit data on the frontend and it is validated and persisted via an API with tests.",
      "Implement a basic analytics dashboard wired to a sample API.",
    ],
  },

  ml: {
    title: "Machine Learning Engineer Intern",
    overview:
      "Focus on ML engineering problems: build reliable model pipelines, monitoring, and deployment patterns so research models become product-ready and maintainable.",
    responsibilities: [
      "Design and implement model training & serving pipelines.",
      "Add monitoring and drift detection for deployed models.",
      "Collaborate with data engineers to ensure data quality and reproducibility.",
    ],
    required: [
      "Python and basic ML knowledge; familiarity with containers and simple orchestration.",
      "Understanding of CI/CD for models and reproducible experiments.",
    ],
    preferred: ["Experience with Airflow/Prefect, MLflow, or Kubernetes basics"],
    perks: [
      "Exposure to production ML systems and MLOps practices",
      "Mentorship in platform and infra engineering",
    ],
    learningOutcomes: [
      "Ship model pipelines that are testable, monitored and maintainable.",
      "Understand building blocks of MLOps and model reliability.",
    ],
    evaluation: [
      "Practical exercise: create a pipeline for training + basic deployment with monitoring hooks.",
      "Technical interview on pipelines, reproducibility and monitoring.",
    ],
    tech: ["Docker", "Kubernetes (basics)", "Airflow", "MLflow", "Python"],
    logistics: [
      "Duration: 8 weeks",
      "Mode: Remote",
      "Commitment: ~20–30 hrs/week",
    ],
    sampleProjects: [
      "Set up a training pipeline that saves artifacts and a simple endpoint to serve predictions with monitoring.",
      "Build a simple retraining job triggered by data volume/quality checks.",
    ],
  },

  py: {
    title: "Python Developer Intern",
    overview:
      "Contribute to backend systems, automation, and data pipelines. Emphasis on clean code, testability, and maintainability for services used by product teams.",
    responsibilities: [
      "Develop backend APIs and services in Python with frameworks like FastAPI or Flask.",
      "Implement ETL or automation tasks and ensure coverage with tests.",
      "Participate in design and code reviews; improve reliability and observability.",
    ],
    required: [
      "Solid Python programming and code hygiene skills.",
      "Familiarity with a web framework (FastAPI, Flask, Django) and SQL databases.",
      "Experience writing unit and integration tests.",
    ],
    preferred: ["Async programming experience, knowledge of message queues (Redis/RabbitMQ) or background job systems"],
    perks: [
      "Ownership of backend components",
      "Mentorship and code reviews from senior engineers",
      "Certificate and real code contributions",
    ],
    learningOutcomes: [
      "Ship backend services with tests and CI/CD and learn observability best practices.",
      "Understand practical API design and data pipeline considerations.",
    ],
    evaluation: [
      "Coding exercise: implement an API endpoint with validation and tests.",
      "Technical interview focusing on Python, system design, and testing.",
    ],
    tech: ["Python", "FastAPI/Flask", "Postgres", "Redis", "pytest", "Docker"],
    logistics: [
      "Duration: 8 weeks",
      "Mode: Remote",
      "Commitment: ~20–30 hrs/week",
    ],
    sampleProjects: [
      "Implement a small service that ingests CSV data, validates and persists it, along with tests and swagger docs.",
      "Create an ETL task that reads from a source, transforms data and loads into a reporting table.",
    ],
  },
};

export default function JobDescriptionPage(): JSX.Element {
  const { roleId } = useParams<{ roleId?: string }>();
  const navigate = useNavigate();
  const key = (roleId ?? "") as RoleKey;

  const role = ROLES[key] ?? null;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = role ? `${role.title} | Technocolabs` : "Job Description | Technocolabs";
    }
  }, [role]);

  if (!role) {
    return (
      <div className="min-h-screen bg-white text-[#0a2540]">
        <section className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold">Role not found</h2>
          <p className="mt-2 text-[#0a2540]/70">
            We couldn't find the job you requested. Go back to the{" "}
            <button className="text-[#1e90ff] underline" onClick={() => navigate("/careers")}>
              careers page
            </button>
            .
          </p>
        </section>
      </div>
    );
  }

  // navigate helper: go to the internship-apply inline page with a prettier role query
  const handleApply = () => {
    const pretty = ROLE_PRETTY[key] ?? ROLE_PRETTY[roleId ?? ""] ?? "";
    if (pretty) {
      navigate(`/internship-apply?role=${encodeURIComponent(pretty)}`);
    } else {
      navigate(`/internship-apply`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0a2540] py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 shadow">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{role.title}</h1>
              <p className="mt-2 text-sm text-[#0a2540]/80">{role.overview}</p>
            </div>
            <div className="text-right">
              <div className="mt-3">
                {/* <button
                  onClick={handleApply}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-4 py-2 text-sm font-semibold text-white shadow"
                >
                  Apply Now
                </button> */}
              </div>
            </div>
          </header>

          <hr className="my-6 border-[#0a2540]/8" />

          <section>
            <h3 className="text-lg font-semibold">Key Responsibilities</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-[#0a2540]/80">
              {role.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>

          <section className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Required Qualifications</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-[#0a2540]/80">
                {role.required.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

              {role.preferred && role.preferred.length > 0 && (
                <>
                  <h4 className="mt-4 font-semibold">Preferred</h4>
                  <ul className="mt-2 list-disc pl-5 text-sm text-[#0a2540]/80">
                    {role.preferred!.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">Perks & Benefits</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-[#0a2540]/80">
                {role.perks.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
                <li>Opportunity to convert to full-time based on performance</li>
              </ul>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-lg font-semibold">Learning Outcomes & Sample Projects</h3>
            <p className="mt-2 text-sm text-[#0a2540]/80">
              You will leave this internship with practical experience you can showcase — examples:
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-[#0a2540]/80">
              {role.sampleProjects.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>

          <section className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Evaluation & Interview Process</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-[#0a2540]/80">
                {role.evaluation.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Tech Stack & Tools</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {role.tech.map((t, i) => (
                  <span key={i} className="rounded-full border px-3 py-1 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-lg font-semibold">Internship Logistics</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-[#0a2540]/80">
              {role.logistics.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
              <li>Compensation: stipend available depending on region and eligibility</li>
            </ul>
          </section>

          <footer className="mt-8 flex gap-3">
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-[#1e90ff] text-white font-semibold shadow"
            >
              Apply Now
            </button>

            <button
              onClick={() => navigate("/careers")}
              className="px-5 py-2 rounded-xl border border-[#0a2540]/10 text-[#0a2540] font-semibold"
            >
              Back to Internships
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
