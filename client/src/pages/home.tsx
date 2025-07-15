import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Job Application Portal</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Find your dream job or manage your hiring process with our comprehensive platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">For Job Seekers</CardTitle>
              <CardDescription className="text-center">
                Browse available positions and submit your application
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <p>
                  Explore job opportunities and submit detailed applications through our user-friendly form
                </p>
                <Link to="/jobs">
                  <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Browse Jobs & Apply
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">For Employers</CardTitle>
              <CardDescription className="text-center">
                Manage job postings and review applications
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <p>
                  Post jobs, manage applications, and find the perfect candidates for your team
                </p>
                <Link to="/login">
                  <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Feature iconColor="text-blue-600" bg="bg-blue-100" title="Fast & Easy" description="Quick application process with intuitive forms" />
            <Feature iconColor="text-green-600" bg="bg-green-100" title="Secure" description="Your data is protected and handled with care" />
            <Feature iconColor="text-purple-600" bg="bg-purple-100" title="Comprehensive" description="Complete solution for both employers and job seekers" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ iconColor, bg, title, description }: { iconColor: string; bg: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className={`${bg} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
        <svg className={`w-8 h-8 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
