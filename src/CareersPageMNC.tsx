// CareersPageMNC.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CareersPageMNC(): JSX.Element {
  const navigate = useNavigate();

  const internships = [
    "AI Engineer Intern",
    "Business Intelligence Developer Intern",
    "Computer Vision Engineer Intern",
    "Data Analyst Intern",
    "Data Scientist Intern",
    "Deep Learning Engineer Intern",
    "Full Stack Developer Intern",
    "Machine Learning Engineer Intern",
    "Python Developer Intern",
  ];

  const ROLE_TITLE_TO_ID: Record<string, string> = {
    "AI Engineer Intern": "genai",
    "Business Intelligence Developer Intern": "bi",
    "Computer Vision Engineer Intern": "cv",
    "Data Analyst Intern": "da",
    "Data Scientist Intern": "ds",
    "Deep Learning Engineer Intern": "dl",
    "Full Stack Developer Intern": "web",
    "Machine Learning Engineer Intern": "ml",
    "Python Developer Intern": "py",
  };

  // id -> pretty role name used by internship-apply page
  const ROLE_ID_TO_PRETTY: Record<string, string> = {
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

  const openJobDescription = (title: string) => {
    const id = ROLE_TITLE_TO_ID[title];
    if (id) navigate(`/job-description/${id}`);
    else navigate(`/job-description`);
  };

  const applyDirect = (id?: string) => {
    const pretty = id ? ROLE_ID_TO_PRETTY[id] ?? "" : "";
    if (pretty) navigate(`/internship-apply?role=${encodeURIComponent(pretty)}`);
    else navigate(`/internship-apply`);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0a2540]">
      {/* HERO */}
      <section className="relative bg-white pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e0ebff] to-white opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0a2540]">
            Build Your Career at <span className="text-[#1e90ff]">Technocolabs</span>
          </h1>
          <p className="mt-4 text-lg text-[#0a2540]/80 max-w-2xl mx-auto">
            Join a global team building AI, Data, and Cloud solutions used by enterprises worldwide.
            Learn, grow, and innovate with real impact.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => navigate("/careers")}
              className="px-6 py-3 rounded-xl bg-[#1e90ff] text-white font-semibold shadow hover:shadow-lg"
            >
              Explore Internships
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-white border border-[#0a2540]/20 text-[#0a2540] font-semibold shadow hover:shadow-lg"
            >
              View Full-Time Roles
            </button>

             <button
              type="button"
              onClick={() => navigate("/spotlight")}
              className="px-6 py-3 rounded-xl bg-[#1e90ff] text-white font-semibold shadow hover:shadow-lg"
            >
              Employee Spotlight
            </button>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">Why Work With Us</h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Work With Global Clients", desc: "Solve problems for enterprises, startups, and research teams across 15+ countries." },
            { title: "Mentorship From Experts", desc: "Get guidance from senior engineers, data scientists, and architects." },
            { title: "AI-First Environment", desc: "Be part of cutting-edge work in AI, ML, Automation, NLP and more." },
            { title: "Flexible Work Options", desc: "Remote, hybrid, and on-prem opportunities depending on projects." },
            { title: "Certificates & Recognition", desc: "Industry-recognized credentials and performance badges." },
            { title: "Real Project Exposure", desc: "Deploy models, build apps, and contribute to production code." },
          ].map((i) => (
            <div key={i.title} className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold">{i.title}</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTERNSHIPS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Internship Opportunities</h2>
          <p className="mt-2 text-[#0a2540]/70 max-w-2xl">Explore hands-on internship tracks designed to make you industry ready.</p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {internships.map((r) => {
              const id = ROLE_TITLE_TO_ID[r];
              return (
                <div key={r} className="rounded-2xl border border-[#0a2540]/10 bg-[#f9fbff] p-6 shadow-sm hover:shadow-lg transition">
                  <h3 className="font-semibold text-lg">
                    {id ? (
                      <Link to={`/job-description/${id}`} className="hover:underline">
                        {r.replace(/ Intern$/i, "")}
                      </Link>
                    ) : (
                      <span>{r}</span>
                    )}
                  </h3>
                  <p className="mt-2 text-sm text-[#0a2540]/70">8–12 weeks • Remote/On-site</p>
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => openJobDescription(r)}
                      className="text-[#1e90ff] font-medium hover:underline"
                    >
                      Job Description →
                    </button>
                    <button
                      type="button"
                      onClick={() => applyDirect(id)}
                      className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#1e90ff] px-3 py-2 text-sm text-white font-semibold"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FULL-TIME */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold">Full-Time Roles</h2>
        <p className="mt-2 text-[#0a2540]/70 max-w-2xl">Join our engineering, AI, analytics, and product teams.</p>

        <div className="mt-10 rounded-2xl border border-[#0a2540]/10 bg-white p-10 shadow-sm">
          <h3 className="text-xl font-semibold">Hiring Soon</h3>
          <p className="mt-2 text-[#0a2540]/70">Full-time roles will be published shortly. Meanwhile, share your resume.</p>
          <a href="mailto:contact@technocolabs.com?subject=Full-Time Application" className="mt-5 inline-flex items-center px-5 py-3 rounded-xl bg-[#1e90ff] text-white font-semibold shadow hover:shadow-lg">
            Email Resume
          </a>
        </div>
      </section>

    {/* CTA */}
<section className="bg-[#0a2540] text-white py-16 border-b-2 border-white">
  <div className="mx-auto max-w-7xl px-6 text-center">
    <h3 className="text-3xl font-bold">Ready to Start Your Journey?</h3>
    <p className="mt-2 text-white/70 max-w-xl mx-auto">
      Build impactful AI and engineering projects with a world-class team.
    </p>
    <button
      type="button"
      onClick={() => navigate("/internship-apply")}
      className="mt-6 px-6 py-3 rounded-xl bg-[#1e90ff] text-white font-semibold shadow hover:shadow-xl"
    >
      Apply Now
    </button>
  </div>
</section>

    </div>
  );
}


