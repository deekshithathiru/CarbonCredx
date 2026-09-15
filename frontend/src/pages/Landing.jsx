import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, BarChart3, Lightbulb, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-white min-h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="rounded-full bg-primary/10 p-4">
                <Leaf className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Measure. Understand. Reduce.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              AI-powered carbon intelligence for modern businesses. Enter your data, calculate your footprint, and discover high-impact reduction opportunities.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/setup"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all flex items-center gap-2"
              >
                Calculate Your Footprint <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/dashboard" className="text-sm font-semibold leading-6 text-slate-900 hover:text-primary transition-colors">
                Explore Dashboard <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-slate-50 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Complete Carbon Intelligence
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                    <BarChart3 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  Scope 1, 2 & 3 Measurement
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Deterministically calculate your total carbon footprint across all scopes using industry-standard emission factors.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                    <Lightbulb className="h-6 w-6" aria-hidden="true" />
                  </div>
                  AI Action Planning
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Receive personalized, high-impact recommendations to reduce your emissions based on your specific operational profile.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                    <Zap className="h-6 w-6" aria-hidden="true" />
                  </div>
                  Carbon Opportunities
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Match with potential carbon projects, renewable energy interventions, and efficiency initiatives.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                    <Leaf className="h-6 w-6" aria-hidden="true" />
                  </div>
                  ESG Reporting
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Generate professional, ready-to-share PDF reports of your carbon footprint and action plans.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
