"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart, Bell, Heart } from "lucide-react";
import Image from "next/image";
import { Element, Link as ScrollLink } from "react-scroll";

const Home: React.FC = () => {
  return (
    <div className="bg-base-100 text-base-content">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="hero-content flex-col lg:flex-row-reverse gap-8">
          <div className="mockup-browser border bg-base-300 flex-1 shadow-2xl">
            <div className="mockup-browser-toolbar">
              <div className="input">https://habitmind.ai</div>
            </div>
            <div className="flex justify-center px-4 py-8 bg-base-200">
              <Image
                src="/dashboard.png"
                className="rounded-lg w-full max-w-lg"
                alt="Habit Tracker Preview"
                width={800}
                height={600}
              />
            </div>
          </div>

          <div className="text-center lg:text-left flex-1">
            <div className="badge badge-secondary mb-4">AI-Powered</div>
            <h1 className="text-5xl font-bold leading-tight">
              Master Your Habits with AI-Driven Insights
            </h1>
            <p className="py-6 text-lg opacity-90">
              Stay consistent with AI-powered tracking, habit decay predictions,
              and personalized insights to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/sign-up" className="btn btn-primary btn-lg">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <ScrollLink
                to="features"
                smooth={true}
                className="btn btn-outline btn-lg"
              >
                Explore Features
              </ScrollLink>
            </div>
          </div>
        </div>
      </div>

      <Element name="howitworks">
        {/* How It Works */}
        <section className="py-20 px-4 text-center bg-base-200" id="howitworks">
          <div className="container mx-auto">
            <div className="badge badge-primary mx-auto mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl font-bold mb-10">How It Works</h2>

            <ul className="steps steps-vertical lg:steps-horizontal w-full">
              <li className="step step-primary">
                <div className="card bg-base-100 shadow-lg p-6 my-4">
                  <div className="badge badge-lg">Step 1</div>
                  <h3 className="text-xl font-semibold my-2">Set Your Habit</h3>
                  <p className="opacity-75">
                    Define what habits you want to build
                  </p>
                </div>
              </li>
              <li className="step step-primary">
                <div className="card bg-base-100 shadow-lg p-6 my-4">
                  <div className="badge badge-lg">Step 2</div>
                  <h3 className="text-xl font-semibold my-2">
                    AI Predicts & Tracks
                  </h3>
                  <p className="opacity-75">
                    Our AI analyzes your behavior patterns
                  </p>
                </div>
              </li>
              <li className="step step-primary">
                <div className="card bg-base-100 shadow-lg p-6 my-4">
                  <div className="badge badge-lg">Step 3</div>
                  <h3 className="text-xl font-semibold my-2">Stay on Track</h3>
                  <p className="opacity-75">
                    Get alerts before you break your streak
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </Element>

      <Element name="features">
        {/* Features Section */}
        <section
          className="py-20 px-4 bg-gradient-to-b from-base-100 to-base-200"
          id="features"
        >
          <div className="container mx-auto">
            <div className="badge badge-secondary mx-auto mb-4">
              What We Offer
            </div>
            <h2 className="text-4xl font-bold text-center mb-16">
              Key Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card bg-primary text-primary-content shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="card-body items-center text-center">
                  <div className="avatar placeholder">
                    <div className="bg-primary-focus text-neutral-content rounded-full w-16">
                      <BarChart className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="card-title text-2xl mt-4">
                    Intuitive habit tracking
                  </h3>
                  <p>
                    Smart insights into your habit-building success with
                    predictive analytics.
                  </p>
                </div>
              </div>

              <div className="card bg-secondary text-secondary-content shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="card-body items-center text-center">
                  <div className="avatar placeholder">
                    <div className="bg-secondary-focus text-neutral-content rounded-full w-16">
                      <Bell className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="card-title text-2xl mt-4">
                    Habit Decay Alerts
                  </h3>
                  <p>
                    Get notified before losing streaks with our intelligent
                    notification system.
                  </p>
                </div>
              </div>

              <div className="card bg-accent text-accent-content shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="card-body items-center text-center">
                  <div className="avatar placeholder">
                    <div className="bg-accent-focus text-neutral-content rounded-full w-16">
                      <Heart className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="card-title text-2xl mt-4">
                    Personalized Insights
                  </h3>
                  <p>
                    Receive custom recommendations and actionable feedback based
                    on your unique habit patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Element>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-content text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Habits?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are building better habits with the
            power of AI predictions.
          </p>
          <Link href="/sign-up" className="btn btn-lg btn-secondary">
            Start Your Journey Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
