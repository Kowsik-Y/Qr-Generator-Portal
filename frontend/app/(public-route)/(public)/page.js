import { Button } from '@/components/ui/button';
import { GraduationCap, Sparkles, Award, Users, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Index = () => {

  return (
    <div>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm mb-8 mx-auto">
            <GraduationCap className="h-14 w-14 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Create & Take Quizzes
            <br />
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            The ultimate quiz platform for educators and learners. Generate quizzes with AI, track progress, and enhance learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="bg-transparent hover:bg-white/10 !border-white/10 shadow-sm hover:text-white text-md px-8 py-5" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size={"lg"} variant="outline" className="!bg-transparent !border-white/20 hover:!text-white hover:!bg-white/10 text-md px-8 py-5">
              <Link href="/signup">Get Started Free<ArrowRight /></Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI-Powered Generation</h3>
            <p className="text-white/70">
              Create quizzes instantly with Gemini AI. Just provide a topic and let AI do the rest.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Role-Based Access</h3>
            <p className="text-white/70">
              Separate roles for students, teachers, and admins with tailored experiences for each.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Track Progress</h3>
            <p className="text-white/70">
              Detailed results and analytics to monitor performance and identify areas for improvement.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 max-w-3xl mx-auto border border-white/20">
            <BookOpen className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/70 mb-6 text-lg">
              Join thousands of educators and learners using Quiz Generator to enhance their learning experience.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-white/60">
          
        </div>
      </div>
    </div>
  );
};

export default Index;